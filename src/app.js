import express from "express";
import cors from "cors";
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

import routes from "./routes.js";
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
