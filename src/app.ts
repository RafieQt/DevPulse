import express, { type Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

export default app;