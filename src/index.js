import express from "express";
import { PORT } from "./config/env.js";
 
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
