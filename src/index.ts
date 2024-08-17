import { Elysia, t } from "elysia";
import { Logger } from "./lib/class";
import { BooksDatabase } from "./db/db";
import { TBook } from "./lib/type";

const app = new Elysia()
            .decorate('db', new BooksDatabase())
            .get("/books", ({db}) => db.getBooks())
            .post("/books", async ({ db, body }) => {
              const { name, author, createdAt } = body;

              const book: TBook = {
                name,
                author,
                createdAt: new Date(createdAt as string),
                insertedAt: new Date,
              };

              const id = (await db.addBook(book)).id;
              return { success: true, id };
              },
              {
                body: t.Object({
                  name: t.String(),
                  author: t.String(),
                  createdAt: t.String(),
                  insertedAt: t.Date({ default: new Date()})
                }),
            })
            .listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
