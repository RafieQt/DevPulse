import express from "express";
import { initDB } from "./db";
const app = express();
const port = 5000;

const main = () => {
  initDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main();
