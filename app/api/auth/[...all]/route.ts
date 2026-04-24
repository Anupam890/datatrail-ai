import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const POST = handler.POST;

export async function GET(request: Request) {
  const url = new URL(request.url);
  console.log("[auth] GET", url.pathname + url.search);
  console.log("[auth] BETTER_AUTH_URL =", process.env.BETTER_AUTH_URL);
  console.log("[auth] GITHUB_CLIENT_ID =", process.env.GITHUB_CLIENT_ID ? "set" : "MISSING");
  console.log("[auth] GITHUB_CLIENT_SECRET =", process.env.GITHUB_CLIENT_SECRET ? "set" : "MISSING");

  const response = await handler.GET(request);
  console.log("[auth] response status:", response.status);
  return response;
}
