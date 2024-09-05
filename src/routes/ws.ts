import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { StatsDatabase } from "../db/stat";
import { WEBSOCKET_HEARTBEAT } from "../lib/constant";
import { broadcastStats } from "../lib/settings";
import { TStatistic } from "../lib/type";

const clients = new Map();
const clientId = crypto.randomUUID()
const data: TStatistic = await new StatsDatabase().getStats();

export const wsRoute = new Elysia()
                           .use(jwt({ name: 'jwt', secret: Bun.env.JWT_SECRET as string}))
                           .ws("/book-stat", {
                            open(ws) {
                              clients.set(ws, clientId)
                              console.log(`Client ${clientId} connected`);
                              setInterval(async () => await broadcastStats(clients, data), WEBSOCKET_HEARTBEAT);
                            },
                            close(ws) {
                              clients.forEach((value, key) => {
                                value.includes(clientId) ? console.log(`Client ${clientId} disconnected`) : null
                              });
                            }
                          })