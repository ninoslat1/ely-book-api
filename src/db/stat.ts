import {Database} from "bun:sqlite"
import { TStatistic } from "../lib/type";

export class StatsDatabase {
    private db: Database

    constructor() {
        this.db = new Database('books.db')
    }

    async getStats(): Promise<TStatistic> {
        const result = await this.db.query(`
          SELECT
            (SELECT COUNT(*) FROM users) AS user_count,
            (SELECT COUNT(*) FROM books) AS book_count;
        `).get() as TStatistic;
      
        return {
          user_count: result.user_count,
          book_count: result.book_count
        };
      }
}