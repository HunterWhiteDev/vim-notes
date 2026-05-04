import { Request, Response } from "express";
import { auth } from "../../../lib/auth/auth";
import { fromNodeHeaders } from "better-auth/node";
import db from "../../../drizzle/drizzle";
import { vimTable } from "../../../drizzle/schema/vimConfig";

export default async function (req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    const { fileData } = req.body;

    if (!session) {
      res.status(401).send({ message: "No auth session found" });
      return;
    }

    const userId = session.user.id;

    await db
      .insert(vimTable)
      .values({ user_id: userId, content: fileData })
      .onConflictDoUpdate({
        target: vimTable.user_id,
        set: { content: fileData },
      });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    if (error instanceof Error)
      res.status(500).send({ message: error.message });
  }
}
