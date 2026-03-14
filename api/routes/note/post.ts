import { Request, response, Response } from "express";
import fs from "fs";
import db from "../../drizzle/drizzle";
import { notesTable } from "../../drizzle/schema";
export default async function postNote(req: Request, res: Response) {
  const { name } = req.params;
  const { fileData } = req.body;

  const respone = await db
    .insert(notesTable)
    .values({ content: "" })
    .returning({ id: notesTable.id });
  console.log({ response });

  res.status(200).send({ success: true });
}
