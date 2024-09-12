import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { StatsDatabase } from "../db/stat";
import { WEBSOCKET_HEARTBEAT } from "../lib/constant";
import { broadcastData } from "../lib/settings";
import { TBook, TStatistic } from "../lib/type";

const clients = new Map();
const clientId = crypto.randomUUID()
const statData: TStatistic = await new StatsDatabase().getStats();
const latestBook: TBook[] = await new StatsDatabase().getLatestBook();

export const wsRoute = new Elysia()
                           .use(jwt({ name: 'jwt', secret: Bun.env.JWT_SECRET as string}))
                           .ws("/stat", {
                            open(ws) {
                              clients.set(ws, clientId)
                              console.log(`Client ${clientId} connected`);
                              setInterval(async () => await broadcastData(clients, {statistic: statData, book: latestBook}), WEBSOCKET_HEARTBEAT);
                            },
                            close(ws) {
                              clients.forEach((value, key) => {
                                value.includes(clientId) ? console.log(`Client ${clientId} disconnected`) : null
                              });
                            }
                          })