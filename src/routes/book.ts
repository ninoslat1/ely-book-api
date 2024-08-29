import Elysia, { t } from "elysia";
import { BooksDatabase } from "../db/book";
import { TBook } from "../lib/type";
import jwt from "@elysiajs/jwt";
import { BookSchema, DetailsBookSchema } from "../dto/book";
import { ElysiaWS } from "elysia/dist/ws";
import { ServerWebSocket } from "bun";

export const bookRoute = new Elysia()
                        .use(jwt({ name: 'jwt', secret: Bun.env.JWT_SECRET as string}))
                        .decorate('book', new BooksDatabase())
                        .get("/books", ({book}) => book.getBooks())
                        .post("/book", async ({ book, body, set, jwt, cookie: {Cookie} }) => {
                            const isLoggedIn = await jwt.verify(Cookie.value)
                            const isExist = await book.getBookByName(body.name)

                            if(!isLoggedIn){
                                set.status = 401
                                return { success: false, message: "Unauthorized"}
                            }

                            if (!isExist) {   
                                const createAction = (await book.addBook(body)).id;
                                set.status = 200
                                return { success: true, message: `Book is created with id ${createAction}` };
                            } else {
                                set.status = 409
                                return { success: false, message: "Book already exists"}
                            }
                        },
                        {
                            body: DetailsBookSchema
                        })
                        .get("/book/:id", async ({book, params, set, jwt, cookie: {Cookie}}) => {
                            const {id} = params
                            const isLoggedIn = await jwt.verify(Cookie.value)
                            const getExistingBook = await book.getBookById(parseInt(id))

                            if(!isLoggedIn){
                                set.status = 401
                                return { success: false, message: "Unauthorized"}
                            }

                            if(getExistingBook){
                                set.status = 200
                                return { success: true, data: getExistingBook}
                            } else {
                                set.status = 404
                                return { success: false, message: "Book not found"}
                            }
                        })
                        .patch("/book/:id", async ({book, params, set, jwt, cookie: {Cookie}, body}) => {
                            const {id} = params
                            const {name, author} = body
                            const createBook: Pick<TBook, "author" | "id" | "name"> = {
                                name,
                                author,
                                id: parseInt(id)
                            }
                            const isLoggedIn = await jwt.verify(Cookie.value)
                            const isExist = await book.getBookById(parseInt(id))

                            if(!isLoggedIn){
                                set.status = 401
                                return { success: false, message: "Unauthorized"}
                            }

                            if(isExist) {
                                await book.updateBookById(createBook)
                                return {success: true, message: "Book updated successfully"}
                            } else {
                                return { success: false, message: "Book not found"}
                            }
                            }, {
                            body: BookSchema,
                            bodyStreamType: 'form-data'
                        })
                        .delete("/book/:id", async ({book, params, body}) => {
                            const {id} = params
                            const {name, author} = body

                            const deletedBook: Pick<TBook, "author" | "id" | "name"> = {
                                name,
                                author,
                                id: parseInt(id)
                            }
                            const isExist = await book.getBookById(parseInt(id))
                            if(isExist) {
                                const deleteAction = await book.deleteBookById(deletedBook)
                                return {success: true, message: "Book deleted successfully"}
                            } else {
                                return {success: false, message: "Book not found"}
                            }
                            }, {
                            body: BookSchema,
                            bodyStreamType: 'form-data'
                        })
                        .ws('/ws/book', {
                            message(ws, message) {
                                ws.send(message)
                            }
                        })
                        