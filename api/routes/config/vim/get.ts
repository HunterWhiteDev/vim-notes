import { Request, Response } from "express";
import { auth } from "../../../lib/auth/auth";
import { fromNodeHeaders } from "better-auth/node";
import db from "../../../drizzle/drizzle";
import { vimTable } from "../../../drizzle/schema/vimConfig";
import { eq } from "drizzle-orm";

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
      .select({ content: vimTable.content })
      .from(vimTable)
      .where(eq(vimTable.user_id, userId));

    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    if (error instanceof Error)
      res.status(500).send({ message: error.message });
  }
}
