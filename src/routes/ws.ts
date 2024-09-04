import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { StatsDatabase } from "../db/stat";
import { WEBSOCKET_HEARTBEAT } from "../lib/constant";

const clients = new Map();
const clientId = crypto.randomUUID()
const data = await new StatsDatabase().getStats();
const broadcastStats = async () => {
  for (const [client] of clients) {
    client.send(JSON.stringify(data));
  }
}

export const wsRoute = new Elysia()
                           .use(jwt({ name: 'jwt', secret: Bun.env.JWT_SECRET as string}))
                           .ws("/book-stat", {
                            async open(ws) {
                              clients.set(ws, clientId)
                              console.log(`Client ${clientId} connected`);
                              setInterval(broadcastStats, WEBSOCKET_HEARTBEAT);
                            },
                            close(ws) {
                              const clientId = clients.get(ws)
                              clients.delete(ws); // Menghapus klien dari daftar
                              console.log(`Client ${clientId} disconnected`);
                            }
                          })