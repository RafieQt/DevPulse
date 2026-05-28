export type TDecodedUser = {
  id: number;
  email: string;
  role: "maintainer" | "contributor";
  iat: number;
  exp: number;
};
