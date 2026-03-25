import { count } from "drizzle-orm";
import db from "../../drizzle/drizzle";
import * as dotenv from "dotenv";
import { auth } from "../auth/auth";
import { account } from "../../drizzle/schema/authSchema";
dotenv.config();
export default async function checkAdminExists() {
  const response = await db.select({ count: count() }).from(account);
  if (response[0].count > 0) {
    console.log("Admin users already exists, skipping seed.");
    return;
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "You do not have an admin email or password setup. Please set up both values in the api/.env file",
    );
  }
  const newUser = await auth.api.createUser({
    body: {
      email: ADMIN_EMAIL, // required
      password: ADMIN_PASSWORD, // required
      name: "Admin", // required
      role: "admin",
    },
  });

  console.log(
    `A new admin account has been created with the email ${ADMIN_EMAIL} and password ${ADMIN_PASSWORD}`,
  );
}
