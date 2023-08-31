import { env } from "@/env.mjs";

export const withBasicAuth = (handler: (request: Request) => Promise<Response> | Response) => {
  return async (request: Request): Promise<Response> => {
    if (env.NODE_ENV !== "development") {
      const auth = request.headers.get("Authorization")?.split(" ")[1];
      const decodedAuth = Buffer.from(auth ?? "", "base64").toString();
      const [, password] = decodedAuth.split(":");

      if (password !== env.ADMIN_KEY) {
        return new Response("Unauthorized", {
          status: 401,
        });
      }
    }

    return handler(request);
  };
};
