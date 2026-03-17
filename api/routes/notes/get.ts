import { Request, Response } from "express";
import db from "../../drizzle/drizzle";
import { notesTable } from "../../drizzle/schema/notes";
import { desc, eq } from "drizzle-orm";
import { auth } from "../../lib/auth/auth";
import { fromNodeHeaders } from "better-auth/node";

export default async function (req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).send({ message: "No auth session found" });
      return;
    }

    const userId = session.user.id;

    const response = await db
      .select({
        id: notesTable.id,
        content: notesTable.content,
        updated_at: notesTable.updated_at,
      })
      .from(notesTable)
      .where(eq(notesTable.user_id, userId))
      .orderBy(desc(notesTable.updated_at));
    res.status(200).send({ notes: response });
  } catch (error) {
    if (error instanceof Error)
      res.status(500).send({ message: error.message });
  }
}
