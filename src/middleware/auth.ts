import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { TDecodedUser } from "../modules/issues/issue.interface";
import { StatusCodes } from "http-status-codes";

type ROLES = "maintainer" | "contributor";
const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        sendResponse(res, {
          statusCode: StatusCodes.UNAUTHORIZED,
          success: false,
          message: "Unauthorized Access!",
        });
        return;
      }
      const decode = jwt.verify(
        token as string,
        config.jwtSecret as string,
      ) as TDecodedUser;

      const userData = await pool.query(
        `
                SELECT * FROM users WHERE email=$1`,
        [decode.email],
      );

      const user = userData.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        sendResponse(res,{
          statusCode: StatusCodes.FORBIDDEN,
          success: false,
          message: "Forbidden Entry!"
        })
        return;
      }

      req.user = decode;
      next();
    } catch (error) {next(error)}
  };
};

export default auth;
