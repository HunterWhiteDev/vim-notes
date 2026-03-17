import { Request, Response } from "express";
import db from "../../drizzle/drizzle";
import { eq } from "drizzle-orm";
import { notesTable } from "../../drizzle/schema/notes";
import { auth } from "../../lib/auth/auth";
import { fromNodeHeaders } from "better-auth/node";

export default async function deleteNote(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).send({ message: "No auth session found." });
      return;
    }

    const selectResponse = await db
      .select({ user_id: notesTable.user_id })
      .from(notesTable)
      .where(eq(notesTable.id, parseInt(id as string)));

    const notesRecord = selectResponse[0];
    if (notesRecord.user_id !== session.user.id) {
      res
        .status(500)
        .send({ message: "You can not delete a note you do not own" });
    }

    await db
      .delete(notesTable)
      .where(eq(notesTable.id, parseInt(id as string)));
    res.status(200).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
}
