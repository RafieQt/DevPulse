import express, { type Application } from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes";
import { issueRouter } from "./modules/issues/issue.route";
import { StatusCodes } from "http-status-codes";

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: StatusCodes.OK, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use('/api/auth', authRouter);
app.use('/api/issues', issueRouter);

export default app;