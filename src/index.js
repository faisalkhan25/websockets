import express from "express";
import { PORT } from "./config/env.js";
import { matchRouter } from "./routes/matches-route.js";
 
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server!" });
});

app.use("/matches", matchRouter)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
