import { t } from "elysia";

export const UserSchema = t.Object({
    username: t.String(),
    password: t.String()
});