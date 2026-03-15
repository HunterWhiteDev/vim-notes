import { Request, Response } from "express";
import fs from "fs";
import db from "../../drizzle/drizzle";
import { notesTable } from "../../drizzle/schema";
export default async function postNote(req: Request, res: Response) {
  const response = await db
    .insert(notesTable)
    .values({ content: "New Note" })
    .returning({ id: notesTable.id, content: notesTable.content });
  console.log({ response });

  res.status(200).send({ success: true, note: response });
}
