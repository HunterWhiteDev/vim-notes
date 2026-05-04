import express from "express";
import * as dotenv from "dotenv";
import getNotes from "./routes/notes/get";
import cors from "cors";
import postNote from "./routes/note/post";
import updateNote from "./routes/note/update";
import deleteNote from "./routes/note/delete";
import getVimConfig from "./routes/config/vim/get";
import putVimConfig from "./routes/config/vim/put";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth/auth";
import checkAdminExists from "./lib/utils/checkAdminExists";
import signUp from "./middleware/signUp";
dotenv.config();

const PORT = process.env.EXPRESS_PORT;
const VITE_ORIGIN = process.env.VITE_ORIGIN;

const app = express();
app.use(
  cors({
    origin: VITE_ORIGIN,
    credentials: true,
  }),
);

app.use(signUp);

//Acording  to better-auth docs this line has to be before express.json() midleware
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

//Routes for all notes
app.get("/notes", getNotes);

//Routes for single note
//module app.get("/note/:name", getNote);
//
app.post("/note", postNote);
app.put("/note/:id", updateNote);
app.delete("/note/:id", deleteNote);

//Config routes
app.get("/config/vim", getVimConfig);
app.put("/config/vim", putVimConfig);

app.listen(PORT, () => {
  checkAdminExists();
  console.log(`Express is running on port ${PORT}`);
});
