import Elysia, { t } from "elysia";
import { UserDatabase } from "../db/user";
import jwt from "@elysiajs/jwt";
import { UserSchema } from "../dto/user";

export const userRoute = new Elysia()
                    .use(jwt({ name: 'jwt', secret: Bun.env.JWT_SECRET as string}))
                    .decorate('user', new UserDatabase())
                    .get("/users", async ({ jwt, set, cookie: { Cookie }, user }) => {
                        const isLoggedIn = await jwt.verify(Cookie.value)
                        if(isLoggedIn){
                            const allUsers = await user.getUsers()
                            set.status = 200
                            return { success: true, data: allUsers };
                        } else {
                            set.status = 401
                            return { success: false, message: "Unauthorized"}
                        }
                    })
                    .post("/register", async ({user, set, body}) => {
                        const isExist = await user.getUserByName(body.username)
                        const createAction = (await user.addUser(body)).id

                        if(!isExist) {
                            set.status = 200
                            return { success: true, message: `User is created with id ${createAction}` };
                        } else {
                            set.status = 409
                            return { success: false, message: "User already exists"}
                        }
                    }, {
                        body: UserSchema,
                        bodyStreamType: 'form-data'
                    })
                    .post("/login", async ({user, body, set, jwt, cookie: {Cookie}}) => {
                        const isExist = await user.login(body)
                        const isLoggedIn = await user.getUserStatus(body.username)

                        if(isLoggedIn){
                            set.status = 406
                            return { success: false, message: "User already logged in"}
                        }

                        if(isExist) {
                            Cookie.set({
                                value: await jwt.sign(isExist),
                                httpOnly: true,
                                maxAge: 5 * 60,
                                path: "/*",
                                sameSite: "strict"
                            })
                            await user.updateStatus(body)
                            set.status = 200
                            return { success: true, message: `User ${isExist.username} login request successful`, token: Cookie.value}
                        } else {
                            set.status = 400
                            return { success: false, message: `Wrong username or passsword`}
                        }
                    }, {
                        body: UserSchema,
                        bodyStreamType: 'form-data'
                    })
                    