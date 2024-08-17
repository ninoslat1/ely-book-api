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

    async addBook(book: TBook) {
        return this.db.query("INSERT INTO books (name, author, createdAt, insertedAt) VALUES (?, ?, ?, ?) RETURNING id").get(book.name, book.author, new Date().toLocaleDateString(), new Date().toLocaleDateString()) as TBook;
    }
    
    async updateBook(book: TBook) {
        if(typeof book.id !== "undefined" && typeof book.id !== null){
            return this.db.query("UPDATE books SET name = ?, author = ?, createdAt = ?, insertedAt = ? WHERE id = ?").run(book.name, book.author, new Date().toLocaleDateString(), new Date().toLocaleDateString(), book.id);
        } else {
            this.logger.log("ID book is required")
        }
    }

    async deleteBook(id: number) {
        if(typeof id !== "undefined" && typeof id !== null){
            return this.db.run(`DELETE FROM books WHERE id = "${id}`)
        } else {
            this.logger.log("ID book is required")
        }
    }

    async init() {
        return this.db.run(`CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, author TEXT, createdAt DATETIME, insertedAt DATETIME)`)
    }
}