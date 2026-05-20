import { Request, Response } from "express";
import { auth } from "../../lib/auth/auth";
import { fromNodeHeaders } from "better-auth/node";
import db from "../../drizzle/drizzle";
import { notesTable } from "../../drizzle/schema/notes";
import { and, eq, gte, like } from "drizzle-orm";

export default async function deleteDirectory(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).send({ message: "No auth session found." });
      return;
    }

    const { directory } = req.body;
    if (!directory) throw new Error("No directory provided");

    await db
      .delete(notesTable)
      .where(
        and(
          like(notesTable.directory, (directory as string) + "%"),
          eq(notesTable.user_id, session.user.id),
        ),
      );
    res.status(200).send();
  } catch (error) {
    console.error("Error deleting note: ", error);
    res.status(500).send();
  }
}
