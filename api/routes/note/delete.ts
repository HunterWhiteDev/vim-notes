import { Request, Response } from "express";
import db from "../../drizzle/drizzle";
import { eq } from "drizzle-orm";
import { notesTable } from "../../drizzle/schema";

export default async function deleteNote(req: Request, res: Response) {
  const { id } = req.params;
  const response = await db
    .delete(notesTable)
    .where(eq(notesTable.id, parseInt(id as string)));
  res.status(200).send();
}
