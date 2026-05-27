import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

type ROLES = "maintainer" | "contributor";
const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized Access!",
        });
      }
      const decode = jwt.verify(
        token as string,
        config.jwtSecret as string,
      ) as JwtPayload;
      console.log("decided ", decode);

      const userData = await pool.query(
        `
                SELECT * FROM users WHERE email=$1`,
        [decode.email],
      );

      const user = userData.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden!",
        });
      }

      req.user = decode;
      next();
    } catch (error) {next(error)}
  };
};

export default auth;
