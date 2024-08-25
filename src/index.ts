import { Elysia, t } from "elysia";
import { Logger } from "./lib/class";
import { TBook } from "./lib/type";
import { UserDatabase } from "./db/user";
import { BooksDatabase } from "./db/book";
import { userRoute } from "./routes/user";
import { bookRoute } from "./routes/book";

const logger = new Logger()

const app = new Elysia()
            .use(userRoute)
            .use(bookRoute)
            .listen(3000);


logger.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
