import {Database} from "bun:sqlite"

export class StatsDatabase {
    private db: Database

    constructor() {
        this.db = new Database('books.db')
    }

    async getStats() {
        return this.db.query("SELECT 'user' AS User, COUNT (*) AS count FROM users UNION ALL SELECT 'book' AS Book, COUNT(*) AS count from books").all()
    }
}