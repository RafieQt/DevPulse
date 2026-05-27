import type { TIssue } from "../auth/auth.interface";


const CreateIssueBD = async(payload : TIssue)=>{
    const {title, description, type} = payload;

    
}

export const issueService = {
    CreateIssueBD
}