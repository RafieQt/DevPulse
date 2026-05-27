import { pool } from "../../db";
import type { TIssue } from "../auth/auth.interface";
import type { TDecodedUser } from "./issue.interface";


const CreateIssueBD = async( payload : TIssue, user:TDecodedUser)=>{
    const {title, description, type, status} = payload;
    const{id} = user;

    const result = await pool.query(`
    INSERT INTO issues(title, description, type, status, reporter_id) VALUES($1, $2, $3, COALESCE($4, 'open'), $5) RETURNING *
    `,[title, description, type, status, id]);

    return result;
}

export const issueService = {
    CreateIssueBD
}