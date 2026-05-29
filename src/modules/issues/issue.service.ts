import { pool } from "../../db";
import type { TIssue } from "../auth/auth.interface";
import type { TDecodedUser, TIssueQuery, updateData } from "./issue.interface";

const CreateIssueBD = async (payload: TIssue, user: TDecodedUser) => {
  const { title, description, type, status } = payload;
  const { id } = user;

  const result = await pool.query(
    `
    INSERT INTO issues(title, description, type, status, reporter_id) VALUES($1, $2, $3, COALESCE($4, 'open'), $5) RETURNING *
    `,
    [title, description, type, status, id],
  );

  return result;
};

const getAllIssuesDB = async (payload: TIssueQuery) => {
  const { sort, type, status } = payload;

  let query = `SELECT * FROM issues`;

  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    conditions.push(`type = $${values.length + 1}`);

    values.push(type);
  }

  if (status) {
    conditions.push(`status = $${values.length + 1}`);

    values.push(status);
  }


  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  if (sort === "oldest") {
    query += ` ORDER BY created_at ASC`;
  } else {
    query += ` ORDER BY created_at DESC`;
  }

  const issuesResult = await pool.query(query, values);

  const issues = issuesResult.rows;


  if (issues.length === 0) {
    return [];
  }

  const reporterIds = issues.map((issue) => issue.reporter_id);

  const usersResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  const userMap = new Map();

  usersResult.rows.forEach((user) => {
    userMap.set(user.id, user);
  });


  const finalData = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: userMap.get(issue.reporter_id),

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));
  
  return finalData;
};

const getSingleIssueDB = async (id: Number) => {
  const issueData = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1 
    `,
    [id],
  );
  const issue = issueData.rows[0];
  const reportedId = issue.reporter_id;

  const reportDetails = await pool.query(
    `
        SELECT id,name,role FROM users WHERE id=$1 
        `,
    [reportedId],
  );

  const reporter = reportDetails.rows[0];

  const finalData = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: {
      id: reporter.id,
      name: reporter.name,
      role: reporter.role,
    },

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };

  return finalData;
};

const updateIssueDB = async (
  issueId: number,
  payload: updateData,
  user: TDecodedUser,
) => {
  const { title, description, type } = payload;

  const { id, role } = user;

  const issueData = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [issueId],
  );

  const issue = issueData.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

 
  if (role === "contributor") {
    if (issue.reporter_id !== id) {
      throw new Error("Unauthorized Access!");
    }

    if (issue.status !== "open") {
      throw new Error("Issue is closed!");
    }
  }

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
    `,
    [title, description, type, issueId],
  );

  return result;
};


const deleteIssueDB= async(id: number)=>{

    const issueData = await pool.query(`
        SELECT * FROM issues WHERE id=$1
        `,[id]);

        if(issueData.rows.length===0){
            throw new Error("The Issue Does not exists!");
        }

    const result = await pool.query(`
        DELETE FROM issues WHERE id=$1 RETURNING *
        `,[id]);

        return result;
}

export const issueService = {
  CreateIssueBD,
  getAllIssuesDB,
  getSingleIssueDB,
  updateIssueDB,
  deleteIssueDB
};
