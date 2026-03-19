# Module-Wise Technical Requirements Document — WhatsApp Bot

## Module 1: Webhook Handler

### Purpose
Receive and validate all incoming events from Meta Cloud WhatsApp API.

### Requirements
- Handle `GET /webhook` for webhook verification (challenge-response)
- Handle `POST /webhook` for message events
- Validate `X-Hub-Signature-256` HMAC signature on all POST requests
- Parse Meta Cloud API payload structure
- Extract message type, sender, group context, and content
- Acknowledge with `200 OK` within 15 seconds (Meta requirement)
- Route parsed event to Command Router

### Error Handling
- Invalid signature → return 401, log warning
- Malformed payload → return 400, log error
- Internal error → return 200 (to avoid Meta retries), log error internally

---

## Module 2: Command Router

### Purpose
Parse WhatsApp message text into commands and route to appropriate handler.

### Requirements
- Detect command prefix (`!` by default, configurable)
- Extract command name (case-insensitive) and arguments
- Look up handler registry for the command
- Check if command is disabled for the group (via DB)
- Apply rate limiting before executing handler
- Apply permission check (admin-only enforcement)
- Call appropriate command handler
- Return response message to sender

### Error Handling
- Unknown command → return `!help` message
- Disabled command → return informative error
- Rate limited → return throttle message
- Permission denied → return permission error message

---

## Module 3: Permission Checker

### Purpose
Enforce admin-only restrictions on group commands.

### Requirements
- For group messages: check if sender is group admin via Meta API
- For private messages: no admin enforcement
- Cache admin list per group (TTL: 60 seconds in Redis)
- Support owner-only commands (phone hash allowlist)
- Bot must be admin to execute admin actions

---

## Module 4: Rate Limiter

### Purpose
Prevent spam and abuse.

### Requirements
- Per-user limit: 5 commands per 10 seconds
- Per-group limit: 20 commands per 10 seconds
- Use Redis counters with TTL for tracking
- Return throttle response when limit exceeded
- Configurable limits via environment variables

---

## Module 5: Group Management Module

### Purpose
Handle all group admin actions.

### Commands: `!kick`, `!add`, `!promote`, `!demote`, `!mute`, `!unmute`, `!link`, `!revoke`, `!groupinfo`, `!tagall`

### Requirements
- All commands require bot to be group admin
- All commands require sender to be group admin
- Interact with Meta Cloud API for participant management
- Store group settings in `groups` PostgreSQL table
- `!tagall` respects group setting `tag_all_enabled`

---

## Module 6: Media Processing Module

### Purpose
Handle sticker creation, audio conversion, and media downloads.

### Commands: `!sticker`, `!toimage`, `!audio`, `!dl`, `!ytmp3`, `!ytmp4`

### Requirements
- Download media from Meta Cloud API using media URL + access token
- Convert image to WebP using `sharp` (static sticker)
- Convert video to animated WebP using `ffmpeg` (animated sticker)
- Convert audio to OGG Opus for voice notes
- Enforce 50MB file size limit
- Delete temp files immediately after delivery
- Offload heavy processing to Redis job queue → worker service

---

## Module 7: TTS Module

### Purpose
Convert text to speech and send as WhatsApp voice note.

### Command: `!tts <text>`

### Requirements
- Support Google TTS and Azure TTS (configurable via `TTS_PROVIDER`)
- Generate OGG Opus audio format (required for WhatsApp voice notes)
- Support multiple languages (detected or specified)
- Max text length: 500 characters
- Temp audio file deleted after delivery

---

## Module 8: Utility Module

### Purpose
Provide search, translation, weather, and other utilities.

### Commands: `!translate`, `!search`, `!wiki`, `!weather`, `!currency`, `!qr`

### Requirements
- `!translate`: Use Google Translate API or LibreTranslate
- `!search`: Use Google Custom Search API or SerpAPI
- `!wiki`: Use Wikipedia REST API
- `!weather`: Use OpenWeatherMap API
- `!currency`: Use ExchangeRate API
- `!qr`: Generate QR code image locally (no external API)

---

## Module 9: Localization Module

### Purpose
Support multi-language bot responses.

### Requirements
- Load language strings from JSON files at startup
- Default language: English (`en`)
- Per-group language setting (stored in DB)
- Per-user language setting (stored in DB, overrides group)
- Fallback to English if string missing in target language
- See `Localization_Guide.md` for translation details

---

## Module 10: Database / Cache Module

### Purpose
Persist settings and manage cache/queues.

### Requirements
- PostgreSQL for persistent data (users, groups, command logs)
- Redis for ephemeral data (rate limits, job queue, session cache)
- Connection pooling for PostgreSQL (min 2, max 10 connections)
- Auto-reconnect on connection loss
- Schema migrations via migration tool (e.g., Flyway or Prisma Migrate)
- See `DB_Schema.md` for full schema
