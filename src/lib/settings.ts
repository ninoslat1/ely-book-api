export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "argon2id",
      memoryCost: 5,
      timeCost: 10,
    });
    return hashedPassword;
  }