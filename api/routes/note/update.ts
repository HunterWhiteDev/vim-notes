import { Request, Response } from "express";
import db from "../../drizzle/drizzle";
import { notesTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export default async function updateNote(req: Request, res: Response) {
  const { id } = req.params;
  const { fileData } = req.body;

  console.log("t");

  console.log({ id, fileData });
  const response = await db
    .update(notesTable)
    .set({ content: fileData })
    .where(eq(notesTable.id, parseInt(id as string)));
  console.log({ response });

  res.status(200).send();
}
