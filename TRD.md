# Technical Requirements Document (TRD) — WhatsApp Bot

## 1) Overview
This document describes the technical requirements for a multi-feature WhatsApp bot built on the **Meta Cloud WhatsApp Business API**.

---

## 2) System Goals
- Respond to user commands in WhatsApp groups and private chats
- Support group admin actions (kick, promote, mute, link)
- Provide media utilities (sticker, audio, TTS, download)
- Support multi-language responses
- Be scalable, low-latency, and maintainable

---

## 3) Technology Stack
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| WhatsApp API | Meta Cloud API (webhooks) |
| Database | PostgreSQL |
| Cache / Queue | Redis |
| Deployment | Railway.com |
| Media Processing | ffmpeg, sharp |
| TTS | Google TTS or Azure TTS |

---

## 4) Functional Requirements

### 4.1 Message Handling
- Parse incoming webhook payloads from Meta Cloud API
- Route messages to appropriate command handlers
- Support text, image, video, audio, document, sticker message types

### 4.2 Command System
- Prefix-based command parsing (e.g., `!command`)
- Admin-only command enforcement in groups
- Help/info command listing all available commands

### 4.3 Group Management
- Kick, add, promote, demote participants
- Fetch and reset group invite link
- Mute/unmute group chat
- Get group info

### 4.4 Media Features
- Create stickers from images/videos
- Convert audio to voice note
- Text-to-speech (TTS) in multiple languages
- Download media from URLs

### 4.5 Utility Features
- Google/Wikipedia search
- Weather info
- Currency conversion
- Language translation

---

## 5) Non-Functional Requirements
- **Availability**: 99.5% uptime target
- **Latency**: Command response < 2 seconds (p95)
- **Throughput**: Handle 100 concurrent group chats
- **Security**: See `Security.md`
- **Scalability**: Horizontal scaling via Railway workers

---

## 6) Constraints
- WhatsApp API rate limits (Meta-imposed)
- Max media size: 50MB
- No storing of message content
- Must comply with WhatsApp Business Policy

---

## 7) Dependencies
- Meta Cloud API credentials
- Railway account
- PostgreSQL instance
- Redis instance
- TTS provider API key (Google or Azure)
