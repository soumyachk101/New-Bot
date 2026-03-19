# Feature List — WhatsApp Bot

---

## Core Features

| # | Feature                        | Status      | Description                                                    |
|---|--------------------------------|-------------|----------------------------------------------------------------|
| 1 | Inbound message handling       | ✅ Required  | Receive and parse all message types from Meta webhook          |
| 2 | Text reply                     | ✅ Required  | Send formatted text responses                                  |
| 3 | Image send/receive             | ✅ Required  | Upload and deliver image media                                 |
| 4 | Audio send/receive             | ✅ Required  | Upload and deliver audio media                                 |
| 5 | Video send/receive             | ✅ Required  | Upload and deliver video media                                 |
| 6 | Document send/receive          | ✅ Required  | Upload and deliver documents (PDF, etc.)                       |
| 7 | Sticker support                | ✅ Required  | Receive and reply with stickers                                |
| 8 | Text-to-Speech (TTS)           | ✅ Required  | Convert text responses to voice messages                       |
| 9 | Multi-language support         | ✅ Required  | Hindi, English, Marathi                                        |
| 10| Webhook signature verification | ✅ Required  | Validate HMAC-SHA256 on all incoming webhooks                  |

---

## Admin Features

| # | Feature                     | Status      | Description                                          |
|---|-----------------------------|-------------|------------------------------------------------------|
| 11| Ban user                    | ✅ Required  | Admin can ban a phone number from interacting        |
| 12| Unban user                  | ✅ Required  | Admin can lift a ban                                 |
| 13| View user list              | ✅ Required  | Paginated list of all users                          |
| 14| Broadcast message           | ✅ Required  | Send a message to all or selected users/groups       |
| 15| Scheduled broadcast         | 🔄 Planned  | Schedule broadcasts for a future date/time           |
| 16| Group bot enable/disable    | ✅ Required  | Toggle bot activity per WhatsApp group               |

---

## Owner Features

| # | Feature                  | Status      | Description                              |
|---|--------------------------|-------------|------------------------------------------|
| 17| Add admin                | ✅ Required  | Owner can promote a phone number to admin|
| 18| Remove admin             | ✅ Required  | Owner can demote an admin                |
| 19| List admins              | ✅ Required  | View all current admins                  |
| 20| System configuration     | 🔄 Planned  | Runtime config update without redeploy   |

---

## Media Processing Features

| # | Feature                    | Status      | Description                                         |
|---|----------------------------|-------------|-----------------------------------------------------|
| 21| Image compression          | ✅ Required  | Compress images using Sharp before upload           |
| 22| Audio transcoding          | ✅ Required  | Convert audio to OGG/Opus for WhatsApp using FFmpeg |
| 23| Video transcoding          | 🔄 Planned  | Convert video to H.264/AAC                          |
| 24| Media expiry cleanup       | ✅ Required  | Delete temporary media files after 24 hours         |

---

## Reliability Features

| # | Feature                   | Status      | Description                                  |
|---|---------------------------|-------------|----------------------------------------------|
| 25| Job retry with back-off   | ✅ Required  | Retry failed jobs up to 3 times              |
| 26| Dead-letter queue         | 🔄 Planned  | Park permanently failed jobs for inspection  |
| 27| Health check endpoint     | ✅ Required  | `GET /health` for liveness probes            |
| 28| Rate limiting             | ✅ Required  | Protect API endpoints from abuse             |
| 29| Structured logging        | ✅ Required  | JSON logs with request ID, level, timestamp  |

---

## Status Legend
- ✅ Required — must be in v1.0
- 🔄 Planned — targeted for v1.1+
