# Implementation Roadmap — WhatsApp Bot

---

## Overview

The project is delivered in 4 phases. Each phase builds on the previous one.

---

## Phase 1 — Foundation (Week 1–2)

| Task | Description | Owner |
|------|-------------|-------|
| 1.1 | Project scaffold (Express, Prisma, TypeScript) | Dev |
| 1.2 | Railway setup (web + worker + Redis + PostgreSQL) | DevOps |
| 1.3 | Meta WABA registration and webhook verification | Dev |
| 1.4 | Inbound webhook handler (signature check, payload parse) | Dev |
| 1.5 | Database schema + Prisma migrations | Dev |
| 1.6 | Basic text reply via Meta API | Dev |
| 1.7 | GitHub Actions CI pipeline (lint + unit tests) | DevOps |

**Milestone:** Bot receives messages and sends text replies. ✅

---

## Phase 2 — Core Features (Week 3–4)

| Task | Description | Owner |
|------|-------------|-------|
| 2.1 | Media handling (image, audio, video, document) | Dev |
| 2.2 | TTS integration (Google or Azure) | Dev |
| 2.3 | BullMQ job queue for TTS + media jobs | Dev |
| 2.4 | Multi-language support (Hindi, English, Marathi) | Dev |
| 2.5 | User management (create on first contact, ban/unban) | Dev |
| 2.6 | Admin REST API (ban, unban, list users) | Dev |
| 2.7 | JWT authentication for admin API | Dev |

**Milestone:** Full media + TTS + admin controls working. ✅

---

## Phase 3 — Advanced Features (Week 5–6)

| Task | Description | Owner |
|------|-------------|-------|
| 3.1 | Owner API (add/remove admins) | Dev |
| 3.2 | Broadcast messages (immediate + scheduled) | Dev |
| 3.3 | Group management (enable/disable bot per group) | Dev |
| 3.4 | Rate limiting on all API endpoints | Dev |
| 3.5 | Structured JSON logging | Dev |
| 3.6 | Integration tests | Dev |

**Milestone:** All v1.0 features complete. ✅

---

## Phase 4 — Hardening & Launch (Week 7–8)

| Task | Description | Owner |
|------|-------------|-------|
| 4.1 | Security audit (HMAC, JWT, input validation) | Dev |
| 4.2 | Load testing (target: 100 msg/s) | Dev |
| 4.3 | End-to-end tests with Meta test number | Dev |
| 4.4 | Documentation review (TRD, API Spec, Runbook) | Dev |
| 4.5 | Production deployment on Railway | DevOps |
| 4.6 | Monitoring & alerting setup | DevOps |
| 4.7 | Go-live | All |

**Milestone:** Production launch. 🚀

---

## Future (v1.1+)

- Dead-letter queue and failed-job dashboard
- Video transcoding
- Chatbot NLP integration (Dialogflow / GPT)
- Web dashboard for admin management
- Webhook event replay

---

## Timeline Summary

```
Week 1–2:  Phase 1 — Foundation
Week 3–4:  Phase 2 — Core Features
Week 5–6:  Phase 3 — Advanced Features
Week 7–8:  Phase 4 — Hardening & Launch
```
