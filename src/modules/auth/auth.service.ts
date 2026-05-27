import { pool } from "../../db";
import type { Iuser } from "./auth.interface";

const createUserIntoDB = async (payload: Iuser) => {
  const { name, email, password, role } = payload;

  const result = await pool.query(
    `
        INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *`,
    [name, email, password, role],
  );
  return result;
};

export const authService = {
  createUserIntoDB,
};
