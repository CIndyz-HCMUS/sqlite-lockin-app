import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT || 4000),
  DB_PATH: process.env.DB_PATH || "lockin.db",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
};
