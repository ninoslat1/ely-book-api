import { Context, Cookie, Elysia, t } from "elysia";
import { Logger } from "./lib/class";
import { userRoute } from "./routes/user";
import { bookRoute } from "./routes/book";
import swagger from "@elysiajs/swagger";
import { APP_PORT, APP_VERSION } from "./lib/constant";
import { wsRoute } from "./routes/ws";

const logger = new Logger()

const app = new Elysia()
            .use(swagger({
              documentation: {
                  info: {
                      title: "Elysia Book API Documentation",
                      version: APP_VERSION
                  }
              }
            }))
            .use(userRoute)
            .use(bookRoute)
            .use(wsRoute)
            .listen(APP_PORT);


logger.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
