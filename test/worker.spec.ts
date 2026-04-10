import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";

const { getVoicesMock, createAudioStreamMock } = vi.hoisted(() => ({
  getVoicesMock: vi.fn(),
  createAudioStreamMock: vi.fn(),
}));

vi.mock("../src/lib/tts", () => ({
  DEFAULT_VOICE: "zh-CN-Xiaoxiao:DragonHDFlashLatestNeural",
  getVoices: getVoicesMock,
  createAudioStream: createAudioStreamMock,
}));

import worker from "../src/index";

const IncomingRequest = Request;

async function dispatch(request: Request) {
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, {} as Env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

const sampleVoices = [
  {
    Name: "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)",
    ShortName: "zh-CN-XiaoxiaoNeural",
    Gender: "Female",
    Locale: "zh-CN",
    SuggestedCodec: "audio-24khz-48kbitrate-mono-mp3",
    FriendlyName: "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)",
    Status: "GA",
    VoiceTag: {
      ContentCategories: ["General"],
      VoicePersonalities: ["Friendly"],
    },
  },
];

describe("worker routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getVoicesMock.mockResolvedValue(sampleVoices);
  });

  it("returns health status", async () => {
    const response = await dispatch(
      new IncomingRequest("https://example.com/health")
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("returns voices", async () => {
    const response = await dispatch(
      new IncomingRequest("https://example.com/voices")
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ voices: sampleVoices });
  });

  it("answers CORS preflight requests", async () => {
    const response = await dispatch(
      new IncomingRequest("https://example.com/tts", {
        method: "OPTIONS",
        headers: {
          Origin: "https://app.example.com",
          "Access-Control-Request-Method": "POST",
        },
      })
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("access-control-allow-methods")).toContain("POST");
  });

  it("returns method not allowed for POST /health", async () => {
    const response = await dispatch(
      new IncomingRequest("https://example.com/health", {
        method: "POST",
      })
    );

    expect(response.status).toBe(405);
    expect(await response.json()).toEqual({
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "method not allowed",
      },
    });
  });

  it("returns not found for unknown routes", async () => {
    const response = await dispatch(
      new IncomingRequest("https://example.com/missing")
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "route not found",
      },
    });
  });
});
