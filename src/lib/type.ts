import { AnyElysia } from "elysia"

export type TBook = {
    id?: number
    name: string
    author: string
    createdAt: string
    insertedAt: Date
}

export type TUser = {
    id?: number
    username: string
    password:string
}

export type TRateLimiter = {
    [ip: string]: number
}

export type TStatistic = {
    book_count: number
    user_count: number
}
