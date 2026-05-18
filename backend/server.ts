import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

await connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
