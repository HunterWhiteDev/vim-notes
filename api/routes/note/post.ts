import { Request, Response } from "express";
import db from "../../drizzle/drizzle";
import { notesTable } from "../../drizzle/schema/notes";
import { auth } from "../../lib/auth/auth";
import { fromNodeHeaders } from "better-auth/node";
export default async function postNote(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const response = await db
      .insert(notesTable)
      .values({ content: "New Note", user_id: session?.user.id })
      .returning({ id: notesTable.id, content: notesTable.content });

    res.status(200).send({ success: true, note: response });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).send({ message: error.message });
  }
}
