import Elysia, { t } from "elysia";
import { UserDatabase } from "../db/user";
import jwt from "@elysiajs/jwt";

export const userRoute = new Elysia()
                    .use(jwt({ name: 'jwt', secret: Bun.env.JWT_SECRET as string}))
                    .decorate('user', new UserDatabase())
                    .get("/users", async ({ jwt, set, cookie: { Cookie }, user }) => {
                        const isLoggedIn = await jwt.verify(Cookie.value)
                        if(isLoggedIn){
                            const allUsers = await user.getUsers()
                            return { success: true, data: allUsers };
                        } else {
                            set.status = 401
                            return { success: false, message: "Unauthorized"}
                        }
                    })
                    .post("/register", async ({user, body}) => {
                        const isExist = await user.getUserByName(body.username)
                        if(!isExist) {
                            const createAction = (await user.addUser(body)).id
                            return { success: true, message: `User is created with id ${createAction}` };
                        } else {
                            return { success: false, message: "User already exists"}
                        }
                    }, {
                        body: t.Object({
                            username: t.String(),
                            password: t.String()
                        })
                    })
                    .post("/login", async ({user, body, jwt, cookie: {Cookie}}) => {
                        const isExist = await user.getUser(body)
                        if(isExist) {
                            Cookie.set({
                                value: await jwt.sign(isExist),
                                httpOnly: true,
                                maxAge: 7 * 86400,
                                path: "/*"
                            })
                            return { success: true, message: `User ${isExist.username} login request successful`, token: Cookie.value}
                        } else {
                            return { success: false, message: `Wrong username or passsword`}
                        }
                    }, {
                        body: t.Object({
                            username: t.String(),
                            password: t.String()
                        })
                    })