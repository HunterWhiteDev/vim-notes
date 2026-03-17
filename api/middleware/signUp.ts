import { NextFunction, Request, Response } from "express";

export default function signUp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const routePath = req.originalUrl;
    const ALLOW_USER_SIGN_UPS = process.env.ALLOW_USER_SIGN_UPS;

    if (
      routePath === "/api/auth/sign-up/email" &&
      ALLOW_USER_SIGN_UPS === "false"
    ) {
      res.status(500).send({ message: "New user sign ups are disabled." });
      return;
    }
    next();
  } catch (error) {
    console.log({ error });
  }
}
