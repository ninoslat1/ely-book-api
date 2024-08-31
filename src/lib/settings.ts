import { ARGON2_MEM_COST, ARGON2_TIME_COST } from "./constant";

export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "argon2id",
      memoryCost: ARGON2_MEM_COST,
      timeCost: ARGON2_TIME_COST,
    });
    return hashedPassword;
  }