import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  neon_string: process.env.NEON_STRING,
  jwtSecret: process.env.JWT_SECRET
};

export default config;
