import { errorResponse, json } from "../lib/http";
import { getVoices } from "../lib/tts";

export async function handleOpenAiVoices() {
  try {
    const voices = await getVoices();

    const mappedVoices = voices.map((voice) => ({
      voice_id: voice.ShortName,
      name: voice.FriendlyName,
      gender: voice.Gender,
      locale: voice.Locale,
      personalities: voice.VoiceTag?.VoicePersonalities ?? [],
      categories: voice.VoiceTag?.ContentCategories ?? [],
    }));

    return json({
      voices: mappedVoices,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "failed to fetch voices";
    return errorResponse(502, "TTS_UPSTREAM_ERROR", message);
  }
}
