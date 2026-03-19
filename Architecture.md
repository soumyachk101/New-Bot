# Architecture — WhatsApp Bot

---

## 1. High-Level Diagram

```
                        ┌──────────────────────────────┐
                        │       Meta Cloud API          │
                        │  (WhatsApp Business Platform) │
                        └──────────┬───────────────────┘
                                   │ HTTPS Webhook / REST
                        ┌──────────▼───────────────────┐
                        │        web service            │
                        │  Express.js  (Node.js 20)     │
                        │  - Webhook handler            │
                        │  - REST API                   │
                        │  - Auth middleware             │
                        └──────┬──────────┬────────────┘
                               │          │
               ┌───────────────▼──┐   ┌───▼──────────────┐
               │   PostgreSQL 15  │   │    Redis 7         │
               │   (Prisma ORM)   │   │  Sessions / Cache  │
               └──────────────────┘   └──────┬────────────┘
                                             │ BullMQ
                                   ┌─────────▼──────────┐
                                   │  worker service     │
                                   │  - TTS jobs         │
                                   │  - Media jobs       │
                                   │  - Broadcast jobs   │
                                   └────────────────────┘
```

---

## 2. Component Descriptions

### 2.1 web service
- Handles all inbound webhooks from Meta.
- Validates HMAC-SHA256 signature on every request.
- Parses message type (text, image, audio, video, document, sticker).
- Dispatches heavy work (TTS, media processing) to the worker via Redis queue.
- Sends immediate text acknowledgements directly via Meta REST API.

### 2.2 worker service
- Consumes jobs from BullMQ queues.
- Performs TTS synthesis (Google or Azure).
- Transcodes media with FFmpeg.
- Uploads processed media to Meta and sends final reply.
- Retries failed jobs with exponential back-off (max 3 retries).

### 2.3 PostgreSQL
- Stores users, admins, groups, message logs, ban list, and scheduled broadcasts.
- Managed via Prisma migrations.

### 2.4 Redis
- Short-lived session/context cache (TTL 30 min).
- BullMQ job queue backing store.

---

## 3. Request Lifecycle

```
Meta → POST /webhook
  → Signature check (HMAC-SHA256)
  → Parse payload
  → Look up user in DB
  → If banned → ignore
  → If TTS/media needed → enqueue job → 200 OK
  → Else → send reply directly → 200 OK

Worker dequeues job
  → TTS synthesis / media transcode
  → Upload to Meta
  → Send reply via Meta API
```

---

## 4. Scalability

- **web** can be scaled horizontally (stateless).
- **worker** can be scaled horizontally (BullMQ distributes jobs).
- Redis and PostgreSQL are shared, managed addons on Railway.

---

## 5. Technology Versions

| Technology   | Version  |
|--------------|----------|
| Node.js      | 20 LTS   |
| Express      | 4.x      |
| Prisma       | 5.x      |
| BullMQ       | 4.x      |
| Redis        | 7.x      |
| PostgreSQL   | 15.x     |
