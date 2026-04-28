import { json } from "../lib/http";

const MODELS = [
  {
    id: "tts-1",
    object: "model",
    created: 1686935002,
    owned_by: "cloudflare-edge-tts",
  },
  {
    id: "tts-1-hd",
    object: "model",
    created: 1686935002,
    owned_by: "cloudflare-edge-tts",
  },
  {
    id: "gpt-4o-mini-tts",
    object: "model",
    created: 1686935002,
    owned_by: "cloudflare-edge-tts",
  },
  {
    id: "gpt-4o-mini-tts-2025-12-15",
    object: "model",
    created: 1686935002,
    owned_by: "cloudflare-edge-tts",
  },
];

export function handleModels() {
  return json({
    object: "list",
    data: MODELS,
  });
}
