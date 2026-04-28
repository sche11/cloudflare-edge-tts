import { createAudioStream, DEFAULT_VOICE } from "../lib/tts";
import { CORS_HEADERS, errorResponse } from "../lib/http";

const OPENAI_VOICE_MAP: Record<string, string> = {
  alloy: "en-US-AvaMultilingualNeural",
  ash: "en-US-AndrewMultilingualNeural",
  ballad: "en-US-EmmaMultilingualNeural",
  coral: "en-US-AriaNeural",
  echo: "en-US-BrianMultilingualNeural",
  fable: "en-US-EmmaMultilingualNeural",
  onyx: "en-US-BrianMultilingualNeural",
  nova: "en-US-JennyNeural",
  sage: "en-US-DavisNeural",
  shimmer: "en-US-MichelleNeural",
  verse: "en-US-ChristopherNeural",
  marin: "en-US-AriaNeural",
  cedar: "en-US-GuyNeural",
};

const SUPPORTED_MODELS = new Set([
  "tts-1",
  "tts-1-hd",
  "gpt-4o-mini-tts",
  "gpt-4o-mini-tts-2025-12-15",
]);

const FORMAT_CONTENT_TYPE: Record<string, string> = {
  mp3: "audio/mpeg",
  opus: "audio/opus",
  aac: "audio/aac",
  flac: "audio/flac",
  wav: "audio/wav",
  pcm: "audio/pcm",
};

type OpenAiTtsBody = {
  model?: unknown;
  input?: unknown;
  voice?: unknown;
  response_format?: unknown;
  speed?: unknown;
};

function isJsonContentType(value: string) {
  const mediaType = value.split(";")[0]?.trim().toLowerCase();
  return mediaType === "application/json";
}

function resolveVoice(voice: unknown): string {
  if (typeof voice === "string") {
    const trimmed = voice.trim();
    if (OPENAI_VOICE_MAP[trimmed]) {
      return OPENAI_VOICE_MAP[trimmed];
    }
    return trimmed;
  }

  if (voice && typeof voice === "object" && !Array.isArray(voice)) {
    const obj = voice as { id?: unknown };
    if (typeof obj.id === "string" && obj.id.trim()) {
      return obj.id.trim();
    }
  }

  return DEFAULT_VOICE;
}

function speedToRate(speed: unknown): string {
  if (typeof speed !== "number" || isNaN(speed)) {
    return "+0%";
  }

  const clamped = Math.min(4.0, Math.max(0.25, speed));
  if (clamped === 1.0) {
    return "+0%";
  }

  const percent = Math.round((clamped - 1.0) * 100);
  return percent >= 0 ? `+${percent}%` : `${percent}%`;
}

function resolveContentType(format: unknown): string {
  if (typeof format !== "string") {
    return "audio/mpeg";
  }

  return FORMAT_CONTENT_TYPE[format.trim().toLowerCase()] ?? "audio/mpeg";
}

async function primeAudioStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const firstChunk = await reader.read();
  let firstChunkConsumed = false;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        if (!firstChunkConsumed) {
          firstChunkConsumed = true;

          if (firstChunk.done) {
            controller.close();
            return;
          }

          controller.enqueue(firstChunk.value);
          return;
        }

        const chunk = await reader.read();
        if (chunk.done) {
          controller.close();
          return;
        }

        controller.enqueue(chunk.value);
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel(reason) {
      await reader.cancel(reason);
    },
  });
}

export async function handleOpenAiTts(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!isJsonContentType(contentType)) {
    return errorResponse(
      400,
      "INVALID_CONTENT_TYPE",
      "content-type must be application/json"
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(
      400,
      "INVALID_REQUEST",
      "request body must be valid json"
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse(
      400,
      "INVALID_REQUEST",
      "request body must be an object"
    );
  }

  const { model, input, voice, response_format, speed } =
    body as OpenAiTtsBody;

  if (typeof model !== "string" || !model.trim()) {
    return errorResponse(400, "INVALID_REQUEST", "model is required");
  }

  if (!SUPPORTED_MODELS.has(model.trim())) {
    return errorResponse(
      400,
      "INVALID_REQUEST",
      `unsupported model: ${model}. supported models: ${[...SUPPORTED_MODELS].join(", ")}`
    );
  }

  if (typeof input !== "string" || input.trim().length === 0) {
    return errorResponse(400, "INVALID_REQUEST", "input is required");
  }

  if (input.length > 4096) {
    return errorResponse(
      400,
      "INVALID_REQUEST",
      "input must be 4096 characters or less"
    );
  }

  const resolvedVoice = resolveVoice(voice);
  const rate = speedToRate(speed);
  const responseContentType = resolveContentType(response_format);

  try {
    const stream = await createAudioStream(
      { text: input.trim(), voice: resolvedVoice, rate },
      undefined
    );
    const primedStream = await primeAudioStream(stream);

    return new Response(primedStream, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": responseContentType,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "failed to synthesize audio";
    return errorResponse(502, "TTS_UPSTREAM_ERROR", message);
  }
}
