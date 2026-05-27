import type { Request, Response } from "express";
import { issueService } from "./issue.service";



const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.CreateIssueBD(req.body);
    
  } catch (error) {
    console.log(error)
  }
};

export const issueController = {
    createIssue
}