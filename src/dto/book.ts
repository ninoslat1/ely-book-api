import { t } from "elysia";

export const BookSchema = t.Object({
  name: t.String(),
  author: t.String(),
});

export const DetailsBookSchema = t.Object({
    name: t.String(),
    author: t.String(),
    createdAt: t.String(),
    insertedAt: t.Date({ default: new Date()})
})