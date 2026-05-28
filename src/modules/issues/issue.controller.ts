import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utils/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new Error("User not found!");
  } else {
    try {
    const result = await issueService.CreateIssueBD(req.body, req.user);
    
    sendResponse(res,{
      statusCode:200,
      success:true,
      message: "Issue created successfully",
      data: result.rows[0]
    })

  } catch (error : any) {
    sendResponse(res,{
      statusCode:401,
      success:true,
      message: error.message,
      error: error
    })
  }
  }
};

export const issueController = {
  createIssue,
};
