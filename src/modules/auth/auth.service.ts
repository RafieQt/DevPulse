import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { Iuser, TIssue, TLogin } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUserIntoDB = async (payload: Iuser) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
        INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *`,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
};



const loginUserDB = async (payload: TLogin) => {
  const { email, password } = payload;

  const userInfo = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );
  if (userInfo.rows.length === 0) {
    throw new Error("user not found!");
  }
  const user = userInfo.rows[0];
  const verify = await bcrypt.compare(password, user.password);
  if (!verify) {
    throw new Error("Invalid Credentials!");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  

  const accessToken = jwt.sign(jwtPayload, config.jwtSecret as string, {
    expiresIn: "1d",
  });

  delete user.password;
  return { accessToken, user };
};







export const authService = {
  createUserIntoDB,
  loginUserDB,

};
