import express from "express";
import * as dotenv from "dotenv";
import getNotes from "./routes/notes/get.ts";
import cors from "cors";
import getNote from "./routes/note/get.ts";
import postNote from "./routes/note/post.ts";
dotenv.config();

const PORT = process.env.EXPRESS_PORT;
const VITE_ORIGIN = process.env.VITE_ORIGIN;

const app = express();
app.use(
  cors({
    origin: VITE_ORIGIN,
  }),
);

app.use(express.json());

//Routes for all notes
app.get("/notes", getNotes);

//Routes for single note
app.get("/note/:name", getNote);
app.post("/note/:name", postNote);

app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}`);
});
