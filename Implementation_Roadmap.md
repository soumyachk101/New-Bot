# Implementation Roadmap — WhatsApp Bot

## Phase 1 — Foundation (Week 1–2)
**Goal:** Working bot that receives and replies to messages.

- [ ] Set up Node.js + Express project
- [ ] Configure Railway deployment (web + worker services)
- [ ] Integrate Meta Cloud API webhook (verify + receive)
- [ ] Implement basic command parser (`!command` prefix)
- [ ] `!ping` command (latency test)
- [ ] `!help` command (list all commands)
- [ ] Set up PostgreSQL schema (users, groups tables)
- [ ] Set up Redis connection
- [ ] Basic error handling and logging
- [ ] Health check endpoint (`GET /health`)

**Milestone:** Bot is live, responds to `!ping` and `!help`.

---

## Phase 2 — Group Management (Week 3–4)
**Goal:** Full group admin command support.

- [ ] Admin permission checker middleware
- [ ] `!kick` — remove participant
- [ ] `!add` — add participant
- [ ] `!promote` / `!demote` — change admin status
- [ ] `!mute` / `!unmute` — restrict group messaging
- [ ] `!link` / `!revoke` — invite link management
- [ ] `!groupinfo` — display group details
- [ ] `!tagall` — mention all group members
- [ ] Group settings stored in PostgreSQL

**Milestone:** All group management commands working.

---

## Phase 3 — Media Features (Week 5–6)
**Goal:** Sticker creation and audio processing.

- [ ] Image → WebP sticker conversion (using `sharp`)
- [ ] Video → animated sticker (using `ffmpeg`)
- [ ] Sticker → image conversion
- [ ] Audio format conversion to voice note
- [ ] Async job queue via Redis (for heavy media tasks)
- [ ] Worker service processing media jobs
- [ ] Temp file cleanup after delivery
- [ ] File size validation (max 50MB)

**Milestone:** `!sticker` and `!audio` commands working.

---

## Phase 4 — Utility Features (Week 7–8)
**Goal:** TTS and search utilities.

- [ ] Text-to-speech (`!tts`) via Google TTS or Azure TTS
- [ ] Language translation (`!translate`)
- [ ] Google/Wikipedia search (`!search`, `!wiki`)
- [ ] Weather info (`!weather`)
- [ ] Currency conversion (`!currency`)
- [ ] QR code generator (`!qr`)

**Milestone:** All utility commands working.

---

## Phase 5 — Polish & Security (Week 9–10)
**Goal:** Production-ready hardening.

- [ ] Rate limiting per user and per group
- [ ] Command enable/disable per group (`!enable`, `!disable`)
- [ ] Multi-language support (English + Hindi at minimum)
- [ ] Anti-link filter (optional per group)
- [ ] Welcome/goodbye messages
- [ ] Comprehensive error messages (user-friendly)
- [ ] Command audit logging (minimal, no content)
- [ ] Webhook signature verification

**Milestone:** Bot is secure and production-ready.

---

## Phase 6 — Launch & Monitoring (Week 11–12)
**Goal:** Go live and monitor.

- [ ] Final Railway deployment configuration
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Log retention policy configured
- [ ] Load testing (50 concurrent users)
- [ ] Ops Runbook finalized (see `Ops_Runbook.md`)
- [ ] Documentation review
- [ ] Soft launch with test group
- [ ] Production launch

**Milestone:** Public launch.

---

## Future / Backlog
- AI chat integration (GPT)
- Poll creation and voting
- Scheduled messages
- Image OCR / recognition
- User reputation/XP system
- Dashboard web UI for group admins
