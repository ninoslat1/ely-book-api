import {Database} from "bun:sqlite"
import { error } from "elysia"
import { TBook } from "../lib/type"
import { Logger } from "../lib/class"

export class BooksDatabase {
    private db: Database
    private logger: Logger

    constructor() {
        this.db = new Database('books.db')
        this.logger = new Logger()
        this.init()
            .then(() => this.logger.log("Database initialized"))
            .catch((error: Error) => this.logger.log(error.message))
    }

    async getBooks() {
        return this.db.query("SELECT * FROM books").all()
    }

    async getBookById(id: number) {
        return this.db.query("SELECT * FROM books WHERE id = ?").get(id)
    }

    async getBookByName(name: string) {
        return this.db.query("SELECT * FROM books WHERE name = ?").get(name)
    }

    async addBook(book: TBook) {
        return this.db.query("INSERT INTO books (name, author, createdAt, insertedAt) VALUES (?, ?, ?, ?) RETURNING id").get(book.name, book.author, book.createdAt, new Date().toISOString().slice(0, 10)) as TBook;
    }
    
    async updateBook(book: TBook) {
        if(typeof book.id !== "undefined" && typeof book.id !== null){
            return this.db.query("UPDATE books SET name = ?, author = ? WHERE id = ?").get(book.name, book.author, book.id);
        } else {
            this.logger.log("ID book is required")
        }
    }

    async deleteBookById(id: number) {
        if(typeof id !== "undefined" && typeof id !== null){
            return this.db.query(`DELETE FROM books WHERE id = ?`).get(id)
        } else {
            this.logger.log("ID book is required")
        }
    }

    async init() {
        return this.db.run(`CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, author TEXT NOT NULL, createdAt DATE NOT NULL, insertedAt DATE)`)
    }
}