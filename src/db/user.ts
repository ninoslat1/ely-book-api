import Database from "bun:sqlite";
import { Logger } from "../lib/class";
import { TUser } from "../lib/type";
import { hashPassword } from "../lib/settings";

export class UserDatabase {
    private db: Database
    private logger: Logger

    constructor() {
        this.db = new Database('books.db')
        this.logger = new Logger()
        this.init()
        .then(() => this.logger.log("User database initialized"))
        .catch((error: Error) => this.logger.log(error.message))
    }

    async getUsers(){
        return this.db.query("SELECT id, username FROM users").all()
    }

    async getUser(user: TUser) {
        const existUser = await this.db.query("SELECT * FROM users WHERE username = ?").get(user.username) as TUser;
        if (existUser) {
          const isPasswordValid = await Bun.password.verify(user.password, existUser.password);
          if (isPasswordValid) {
            return existUser;
          }
        }
        return null;
      }

    async getUserByName(username: string) {
        return this.db.query("SELECT * FROM users WHERE username = ?").get(username)
    }

    async addUser(user: TUser) {
        return this.db.query("INSERT INTO users (username, password) VALUES (?, ?) RETURNING id").get(user.username, await hashPassword(user.password)) as TUser;
    }
    
    async updateUser(user: TUser) {
        if(typeof user.id !== "undefined" && typeof user.id !== null){
            return this.db.query("UPDATE users SET username = ?, password = ? WHERE id = ?").get(user.username, await hashPassword(user.password), user.id) as TUser;
        }
    }

    async deleteUser(user: TUser) {
        if(typeof user.id !== "undefined" && typeof user.id !== null){
            return this.db.query("DELETE users WHERE username = ? AND password = ? AND id = ?").get(user.username, await hashPassword(user.password), user.id) as TUser;
        }
    }

    async init() {
        return this.db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)`)
    }
}