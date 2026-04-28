# cloudflare-edge-tts

Minimal Cloudflare Worker that exposes Microsoft Edge Text-to-Speech over HTTP using a Worker-native implementation built on `fetch(..., { Upgrade: "websocket" })`.

## Endpoints

### `GET /health`

Returns a lightweight health response:

```json
{
  "ok": true
}
```

### `GET /voices`

Returns the available Edge TTS voices:

```json
{
  "voices": [
    {
      "Name": "Microsoft Server Speech Text to Speech Voice (en-US, AvaMultilingualNeural)",
      "ShortName": "en-US-AvaMultilingualNeural"
    }
  ]
}
```

The `voices` payload includes `ShortName` values. This Worker's default voice is `en-US-AvaMultilingualNeural`. Callers may pass any discovered `ShortName`, and the Worker also accepts certain provider-style aliases when they can be mapped to a compatible Edge TTS voice.

### `POST /tts`

Synthesizes speech and streams `audio/mpeg` back to the client.

Request body:

```json
{
  "text": "你好，世界",
  "voice": "en-US-AvaMultilingualNeural"
}
```

`voice` is optional. When omitted, the Worker uses `en-US-AvaMultilingualNeural`.

Validation and error behavior:

- Requires `Content-Type: application/json`
- Requires a non-empty string `text`
- Rejects empty `voice` strings
- Returns `502` when the upstream TTS request fails before the audio response starts, for example before or while priming the first chunk

## OpenAI Compatible API

This Worker also provides OpenAI-compatible endpoints for easy integration with existing tools and SDKs.

### `POST /v1/audio/speech`

OpenAI-compatible speech synthesis endpoint.

Request body:

```json
{
  "model": "tts-1",
  "input": "你好，世界",
  "voice": "alloy",
  "speed": 1.0
}
```

Parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | Supported: `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts` |
| `input` | string | Yes | Text to synthesize (max 4096 chars) |
| `voice` | string | Yes | Voice ID or Edge TTS voice name |
| `speed` | number | No | Speech speed, 0.25 to 4.0, default 1.0 |
| `response_format` | string | No | Audio format (always returns MP3) |

Voice mapping:

| OpenAI Voice | Edge TTS Voice |
|-------------|----------------|
| `alloy` | en-US-AvaMultilingualNeural |
| `ash` | en-US-AndrewMultilingualNeural |
| `ballad` | en-US-EmmaMultilingualNeural |
| `coral` | en-US-AriaNeural |
| `echo` | en-US-BrianMultilingualNeural |
| `fable` | en-US-EmmaMultilingualNeural |
| `onyx` | en-US-BrianMultilingualNeural |
| `nova` | en-US-JennyNeural |
| `sage` | en-US-DavisNeural |
| `shimmer` | en-US-MichelleNeural |
| `verse` | en-US-ChristopherNeural |
| `marin` | en-US-AriaNeural |
| `cedar` | en-US-GuyNeural |

You can also use any Edge TTS voice name directly (e.g., `zh-CN-XiaoxiaoNeural`).

### `GET /v1/audio/voices`

Returns all available Edge TTS voices with their metadata:

```json
{
  "voices": [
    {
      "voice_id": "zh-CN-XiaoxiaoNeural",
      "name": "Xiaoxiao",
      "gender": "Female",
      "locale": "zh-CN",
      "personalities": ["Friendly", "Positive"],
      "categories": ["News", "Novel"]
    }
  ]
}
```

### `GET /v1/models`

Returns supported models:

```json
{
  "object": "list",
  "data": [
    {
      "id": "tts-1",
      "object": "model",
      "created": 1686935002,
      "owned_by": "cloudflare-edge-tts"
    }
  ]
}
```

### OpenAI SDK Usage

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://your-worker.workers.dev/v1",
    api_key="not-needed"
)

response = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="你好，世界"
)

response.stream_to_file("speech.mp3")
```

## Setup

Install dependencies:

```bash
npm install
```

Generate Worker environment types:

```bash
npm run cf-typegen
```

## Development

Remote runtime development with Cloudflare:

```bash
npm run dev
```

Local runtime development:

```bash
npm run dev:local
```

## Testing

Run the test suite:

```bash
npm test
```

Run TypeScript checks:

```bash
npm run typecheck
```

## Remote Smoke Test

Real-runtime validation uses `wrangler dev --remote`.

Confirm the authenticated Cloudflare account:

```bash
npx wrangler whoami
```

Start the remote dev server on localhost:

```bash
npm run dev
```

Use the actual URL printed by Wrangler if it differs from `http://127.0.0.1:8787`.

In another terminal, run the smoke test:

```bash
curl -i --max-time 20 http://127.0.0.1:8787/health
curl -sS --max-time 20 \
  -D /tmp/cloudflare-edge-tts-voices.headers \
  http://127.0.0.1:8787/voices \
  --output /tmp/cloudflare-edge-tts-voices.json && \
  awk 'NR==1 { print $2 }' /tmp/cloudflare-edge-tts-voices.headers
curl -sS --max-time 30 \
  -D /tmp/cloudflare-edge-tts-tts.headers \
  -H 'Content-Type: application/json' \
  http://127.0.0.1:8787/tts \
  --data '{"text":"你好，世界"}' \
  --output /tmp/cloudflare-edge-tts-tts.body && \
  awk 'NR==1 { print $2 }' /tmp/cloudflare-edge-tts-tts.headers && \
  file /tmp/cloudflare-edge-tts-tts.body
```

Expected checks:

- `/health` should return `200`
- `/voices` should write headers to `/tmp/cloudflare-edge-tts-voices.headers`, write JSON to `/tmp/cloudflare-edge-tts-voices.json`, and report an HTTP `200` status
- The voices response should contain one or more `ShortName` entries
- `/tts` should write headers to `/tmp/cloudflare-edge-tts-tts.headers`, write the response body to `/tmp/cloudflare-edge-tts-tts.body`, and report the HTTP status
- A successful `/tts` call should be `200` with `audio/mpeg`; a failure should remain inspectable as headers plus a non-audio body, such as a JSON error response

## Deployment

Deploy the Worker:

```bash
npm run deploy
```

## Implementation Note

This Worker does not rely on `edge-tts-universal` at runtime. It performs the voice-list fetch and WebSocket synthesis handshake directly inside the Worker runtime.

## Notes

Observed remote validation result on 2026-04-10 with `wrangler 4.81.1`:

- `npx wrangler whoami` succeeded
- The authenticated Cloudflare account context used for the run was `1f1d1678a2413a54c944b3081bab5c84`
- `npm run dev` started `wrangler dev --remote`, uploaded a remote preview, and reported `Ready on http://localhost:8787`
- `curl -i --max-time 20 http://127.0.0.1:8787/health` returned `200 OK`
- The `/voices` smoke test returned `200`, produced `/tmp/cloudflare-edge-tts-voices.headers`, and wrote a JSON payload containing `ShortName` entries to `/tmp/cloudflare-edge-tts-voices.json`
- The `/tts` smoke test returned `200`, produced `/tmp/cloudflare-edge-tts-tts.headers`, and wrote an `audio/mpeg` body to `/tmp/cloudflare-edge-tts-tts.body`

This means the current Worker-native implementation was verified successfully against both `wrangler dev --local` and `wrangler dev --remote` in this environment.
