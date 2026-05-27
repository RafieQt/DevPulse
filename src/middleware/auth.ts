import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from "../config";

type ROLES = "maintainer" | "contributor";
const auth = (...roles: ROLES[])=>{
    return async(req: Request, res: Response, next: NextFunction)=>{

        try {
            const token = req.headers.authorization;

            if(!token){
                sendResponse(res,{
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized Access!"
                })
            }
            const decode = jwt.verify(token as string, config.jwtSecret as string) as JwtPayload;
            console.log("decided ",decode);
        } catch (error) {
            
        }
    }
}



export default auth;