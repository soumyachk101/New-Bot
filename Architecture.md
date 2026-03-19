# System Architecture — WhatsApp Bot

## 1) High-Level Overview

```
User (WhatsApp) ──► Meta Cloud API ──► Webhook (web service)
                                             │
                              ┌──────────────┴──────────────┐
                              │                             │
                         Command Router              Job Queue (Redis)
                              │                             │
                    ┌─────────┴─────────┐            Worker Service
                    │                   │                   │
              Group Handlers      Utility Handlers    Media Processing
                    │                   │             (ffmpeg / sharp)
                    └────────┬──────────┘
                             │
                        PostgreSQL
```

---

## 2) Services

### 2.1 web (API Service)
- Receives webhook POST from Meta Cloud
- Verifies webhook signature
- Parses message payload
- Routes to command handlers
- Sends reply via Meta Cloud API

### 2.2 worker (Job Service)
- Processes async jobs from Redis queue
- Handles heavy media tasks (video sticker, TTS, download)
- Reports result back to web service via Redis pub/sub

---

## 3) Data Flow

1. User sends message → Meta Cloud API → `POST /webhook`
2. `web` service validates & parses payload
3. Command is identified and routed
4. If lightweight → execute inline, reply immediately
5. If heavy (media/TTS) → push job to Redis queue
6. `worker` picks up job, processes, stores result temporarily
7. `web` sends result back to WhatsApp user

---

## 4) Storage

| Store | Purpose |
|-------|---------|
| PostgreSQL | User prefs, group settings, command logs |
| Redis | Job queue, rate-limit counters, session cache |
| Temp FS | Transient media files (auto-deleted after send) |

---

## 5) External APIs

| Service | Usage |
|---------|-------|
| Meta Cloud API | Send/receive WhatsApp messages |
| Google TTS / Azure TTS | Text-to-speech audio generation |
| Google Search API | Web search results |
| OpenWeatherMap API | Weather data |
| ExchangeRate API | Currency conversion |

---

## 6) Scalability
- `web` service can scale horizontally (stateless)
- `worker` service can scale horizontally (job queue handles distribution)
- Redis handles shared state across instances

---

## 7) Reliability
- Health check endpoint: `GET /health`
- Dead-letter queue for failed jobs
- Retry logic: 3 attempts with exponential backoff
- Railway auto-restart on crash
