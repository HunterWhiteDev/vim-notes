import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../../drizzle/drizzle"; // your drizzle instance
import { admin } from "better-auth/plugins";
import * as authSchema from "../../drizzle/schema/authSchema";
import * as dotenv from "dotenv";
dotenv.config();

const VITE_ORIGIN = process.env.VITE_ORIGIN || "";

export const auth = betterAuth({
  plugins: [admin()],
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  trustedOrigins: [VITE_ORIGIN],
});
