import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { userRouter } from "./controllers/users.js";
import { loudsRouter } from "./controllers/louds.js";
import { messagesRouter } from "./controllers/messages.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use(cors());

//for images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//routes
app.use("/auth", userRouter);
app.use("/louds", loudsRouter);
app.use("/messages", messagesRouter);

//for react static files
app.use(express.static(path.join(__dirname, "./app/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./app/build/index.html"));
});

app.listen(3001, () => console.log("Server started"));
