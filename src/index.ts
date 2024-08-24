import { Elysia, t } from "elysia";
import { Logger } from "./lib/class";
import { BooksDatabase } from "./db/db";
import { TBook } from "./lib/type";

const app = new Elysia()
            .decorate('db', new BooksDatabase())
            .decorate('logger', new Logger())
            .get("/books", ({db}) => db.getBooks())
            .post("/books", async ({ db, body }) => {
              const id = (await db.addBook(body)).id;
              return { success: true, message: `Book is created with id ${id}` };
              },
              {
                body: t.Object({
                  name: t.String(),
                  author: t.String(),
                  createdAt: t.String(),
                  insertedAt: t.Date({ default: new Date()})
                }),
            })
            .get("/book/:id", async ({db, params}) => {
              const {id} = params

              const book = await db.getBookById(parseInt(id))
              return { success: true, data: book}
            })  
            .listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
