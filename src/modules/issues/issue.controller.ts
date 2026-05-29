import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new Error("User not found!");
  } else {
    try {
      const result = await issueService.CreateIssueBD(req.body, req.user);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Issue created successfully",
        data: result.rows[0],
      });
    } catch (error: any) {
      sendResponse(res, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message,
        error: error,
      });
    }
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  const sort = req.query.sort as string;
  const type = req.query.type as string;
  const status = req.query.status as string;
  const payload = { sort, type, status };

  try {
    const result = await issueService.getAllIssuesDB(payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issues retrived successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const result = await issueService.getSingleIssueDB(id as number);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue retrived successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  const issueId = Number(req.params.id);
  try {
    const result = await issueService.updateIssueDB(
      issueId,
      req.body,
      req.user,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const result = await issueService.deleteIssueDB(id as number);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
