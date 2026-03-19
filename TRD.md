# Technical Requirements Document (TRD)
## WhatsApp Bot Project

---

## 1. Overview

This document defines the technical requirements for the WhatsApp Bot built on the Meta WhatsApp Business Cloud API. The bot supports multi-language messaging, media handling, text-to-speech (TTS), group management, and administrative controls.

---

## 2. Goals

- Provide an automated, always-on WhatsApp assistant.
- Support Hindi, English, and Marathi languages.
- Enable admin and owner-level controls over bot behaviour.
- Process media (images, audio, video, documents) reliably.
- Deliver voice responses via TTS.

---

## 3. Functional Requirements

| ID   | Requirement                                           | Priority |
|------|-------------------------------------------------------|----------|
| FR-1 | Receive and process inbound WhatsApp messages         | High     |
| FR-2 | Send text, image, audio, video, and document replies  | High     |
| FR-3 | Convert text responses to voice (TTS)                 | High     |
| FR-4 | Support Hindi, English, and Marathi                   | High     |
| FR-5 | Admin can ban/unban users                             | High     |
| FR-6 | Owner can add/remove admins                           | High     |
| FR-7 | Group-level bot enable/disable                        | Medium   |
| FR-8 | Scheduled broadcast messages                          | Medium   |
| FR-9 | Webhook signature verification                        | High     |
| FR-10| Retry failed message deliveries                       | Medium   |

---

## 4. Non-Functional Requirements

| ID    | Requirement                                      | Target          |
|-------|--------------------------------------------------|-----------------|
| NFR-1 | API response time (p95)                          | < 500 ms        |
| NFR-2 | System uptime                                    | 99.5%           |
| NFR-3 | Message processing throughput                    | 100 msg/s       |
| NFR-4 | TTS generation latency                           | < 2 s           |
| NFR-5 | Database query time (p95)                        | < 100 ms        |
| NFR-6 | Webhook payload processing                       | < 200 ms        |

---

## 5. Technical Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Runtime      | Node.js 20 LTS                    |
| Framework    | Express.js                        |
| Database     | PostgreSQL 15                     |
| Cache / Queue| Redis 7                           |
| ORM          | Prisma                            |
| TTS          | Google Cloud TTS / Azure Cognitive|
| Media        | FFmpeg, Sharp                     |
| Deployment   | Railway.com                       |
| CI/CD        | GitHub Actions                    |

---

## 6. Integration Points

- **Meta WhatsApp Business Cloud API** — inbound/outbound messaging, media upload/download.
- **Google Cloud TTS or Azure Cognitive Services** — voice synthesis.
- **PostgreSQL** — persistent data storage.
- **Redis** — session cache, job queues (BullMQ).

---

## 7. Constraints

- All media files stored temporarily; purged after 24 hours.
- Secrets managed via environment variables only (no hardcoded credentials).
- Webhook endpoint must be HTTPS.
- Phone numbers stored in E.164 format.

---

## 8. Assumptions

- A single WhatsApp Business Account (WABA) is used.
- The deployment platform supports persistent filesystem or object storage for media.
- The owner phone number is pre-configured at deployment time.
