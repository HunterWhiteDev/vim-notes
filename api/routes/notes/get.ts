import { Request, Response } from "express";
import db from "../../drizzle/drizzle";
import { notesTable } from "../../drizzle/schema";
import { desc } from "drizzle-orm";

export default async function (req: Request, res: Response) {
  const response = await db
    .select({ id: notesTable.id, content: notesTable.content })
    .from(notesTable)
    .orderBy(desc(notesTable.updated_at));
  console.log({ response });
  res.status(200).send({ notes: response });
}
