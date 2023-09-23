import { PrivyClient } from "@privy-io/server-auth";
import { parse } from "cookie";

export function getPrivyClient() {
  return new PrivyClient(
    process.env.PRIVY_APP_ID || "",
    process.env.PRIVY_APP_SECRET || "",
  );
}

// check if user logged in
export const authCheck = async (req: Request): Promise<any> => {
  const privy = getPrivyClient();
  const cookies = parse(req.headers.get("cookie") || "");
  const authToken =
    req.headers.get("Authorization")?.replace("Bearer ", "") ||
    cookies["privy-token"];

  if (!authToken) {
    return null;
  }
  const verifiedClaims = await privy.verifyAuthToken(authToken);
  return verifiedClaims;
};

// takes user privy DID (e.g. authCheck().userId)
export const getPrivyUserById = async (id: string): Promise<any> => {
  const privy = getPrivyClient();
  const user = await privy.getUser(id);
  return user;
};
