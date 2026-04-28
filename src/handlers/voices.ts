import { errorResponse, json } from "../lib/http";
import { getVoices } from "../lib/tts";

export async function handleVoices() {
  try {
    const voices = await getVoices();
    return json({ voices });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "failed to fetch voices";
    return errorResponse(502, "TTS_UPSTREAM_ERROR", message);
  }
}
