import { INDEX_HTML } from "./lib/html";
import { handleHealth } from "./handlers/health";
import { handleModels } from "./handlers/openai-models";
import { handleOpenAiTts } from "./handlers/openai-tts";
import { handleOpenAiVoices } from "./handlers/openai-voices";
import { handleTts } from "./handlers/tts";
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

  if (pathname === "/tts") {
    if (request.method !== "POST") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleTts(request);
  }

  if (pathname === "/v1/audio/speech") {
    if (request.method !== "POST") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleOpenAiTts(request);
  }

  if (pathname === "/v1/audio/voices") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleOpenAiVoices();
  }

  if (pathname === "/v1/models") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleModels();
  }

  if (pathname === "/v1/voices") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return handleOpenAiVoices();
  }

  if (pathname === "/" || pathname === "/index.html") {
    if (request.method !== "GET") {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "method not allowed");
    }

    return new Response(INDEX_HTML, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  return errorResponse(404, "NOT_FOUND", "route not found");
}

export default {
  async fetch(
    request: Request,
    _env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    try {
      const response = await routeRequest(request);
      return withCors(response);
    } catch {
      return errorResponse(500, "INTERNAL_ERROR", "unexpected internal error");
    }
  },
} satisfies ExportedHandler<Env>;
