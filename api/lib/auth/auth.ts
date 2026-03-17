import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../../drizzle/drizzle"; // your drizzle instance
import { admin } from "better-auth/plugins";
import * as authSchema from "../../drizzle/schema/authSchema";
import * as dotenv from "dotenv";
dotenv.config();

const VITE_ORIGIN = process.env.VITE_ORIGIN || "";
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || "";
if (!BETTER_AUTH_SECRET)
  throw new Error("BETTER_AUTH_SECRET is not defined in api/.env");

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
