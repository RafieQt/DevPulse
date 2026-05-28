export type TDecodedUser = {
  id: number;
  email: string;
  role: "maintainer" | "contributor";
  iat: number;
  exp: number;
};

export interface TIssueQuery {
  sort?: string;
  type?: string;
  status?: string;
}