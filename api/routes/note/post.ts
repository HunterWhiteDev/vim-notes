import { Request, Response } from "express";
import fs from "fs";
export default function postNote(req: Request, res: Response) {
  const { name } = req.params;
  const { fileData } = req.body;

  fs.writeFileSync(`/home/flawda/.notes/${name}`, fileData);
  res.status(200).send({ success: true });
}
