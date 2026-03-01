import { Request, Response } from "express";
import fs from "fs";

export default async function (req: Request, res: Response) {
  const files = fs.readdirSync("/home/flawda/.notes/");

  const fileArr: string[] = [];

  for (const file of files) {
    const fileData = fs.readFileSync(`/home/flawda/.notes/${file}`, "utf-8");
    fileArr.push(fileData);
  }

  res.status(200).send({ fileNames: files, filesData: fileArr });
}
