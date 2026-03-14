import { Request, Response } from "express";
import db from "../../drizzle/drizzle";
import { notesTable } from "../../drizzle/schema";

export default async function (req: Request, res: Response) {
  const response = await db.select().from(notesTable);
  res.status(200).send({ notes: response });
}
