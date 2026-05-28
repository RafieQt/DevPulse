import { pool } from "../../db";
import type { TIssue } from "../auth/auth.interface";
import type { TDecodedUser, TIssueQuery } from "./issue.interface";

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

  // filter by type
  if (type) {
    conditions.push(`type = $${values.length + 1}`);

    values.push(type);
  }

  // filter by status
  if (status) {
    conditions.push(`status = $${values.length + 1}`);

    values.push(status);
  }

  // add WHERE condition
  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  // sorting
  if (sort === "oldest") {
    query += ` ORDER BY created_at ASC`;
  } else {
    query += ` ORDER BY created_at DESC`;
  }

  // get all issues
  const issuesResult = await pool.query(query, values);

  const issues = issuesResult.rows;

  // if no issues found
  if (issues.length === 0) {
    return [];
  }

  // get all reporter ids
  const reporterIds = issues.map((issue) => issue.reporter_id);

  // get reporter info WITHOUT JOIN
  const usersResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  // create user map
  const userMap = new Map();

  usersResult.rows.forEach((user) => {
    userMap.set(user.id, user);
  });

  // attach reporter info manually
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
  console.log(finalData);
  return finalData;
};

export const issueService = {
  CreateIssueBD,
  getAllIssuesDB,
};
