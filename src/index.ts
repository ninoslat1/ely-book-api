import { Elysia, t } from "elysia";
import { Logger } from "./lib/class";
import { userRoute } from "./routes/user";
import { bookRoute } from "./routes/book";
import swagger from "@elysiajs/swagger";

const logger = new Logger()

const app = new Elysia()
            .use(swagger({
              documentation: {
                  info: {
                      title: "Elysia Book API Documentation",
                      version: "1.0.0"
                  }
              }
            }))
            .use(userRoute)
            .use(bookRoute)
            .listen(3000);


logger.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
