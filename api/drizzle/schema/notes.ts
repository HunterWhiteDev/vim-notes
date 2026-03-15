import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./authSchema";

export const notesTable = pgTable("notes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: text(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  user_id: text().references(() => user.id),
});
