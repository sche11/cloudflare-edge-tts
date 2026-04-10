import { handleHealth } from "./handlers/health";
import { handleVoices } from "./handlers/voices";
import { errorResponse, noContent, withCors } from "./lib/http";

async function routeRequest(request: Request) {
  const { pathname } = new URL(request.url);

  if (request.method === "OPTIONS") {
    return noContent();
  }

  if (pathname === "/health") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleHealth();
  }

  if (pathname === "/voices") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleVoices();
  }

  return errorResponse(404, "NOT_FOUND", "route not found");
}

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const response = await routeRequest(request);
      return withCors(response);
    } catch {
      return errorResponse(500, "INTERNAL_ERROR", "unexpected internal error");
    }
  },
} satisfies ExportedHandler<Env>;
