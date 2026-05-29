import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User Created",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message,
      errors: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserDB(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User Exists!",
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message,
      errors: error,
    });
  }
};

export const authController = {
  createUser,
  loginUser,
};
