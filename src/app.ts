import express, { type Application } from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes";
import { issueRouter } from "./modules/issues/issue.route";

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use('/api/auth', authRouter);
app.use('/api/issues', issueRouter);

export default app;