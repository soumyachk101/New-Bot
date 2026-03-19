# Test Plan — WhatsApp Bot

## 1) Overview
This document describes the testing strategy and test cases for the WhatsApp bot.

---

## 2) Test Levels

| Level | Scope | Tools |
|-------|-------|-------|
| Unit | Individual functions/handlers | Jest / Mocha |
| Integration | API routes + DB + Redis | Jest + Supertest |
| End-to-End | Full WhatsApp message flow | Manual / Postman |
| Load | Concurrent command handling | Artillery / k6 |

---

## 3) Unit Tests

### 3.1 Command Parser
- [ ] Correctly parses `!command` prefix
- [ ] Returns null for non-command messages
- [ ] Extracts command name and arguments
- [ ] Handles empty arguments gracefully
- [ ] Case-insensitive command matching

### 3.2 Permission Checker
- [ ] Returns `true` for admin commands sent by admin
- [ ] Returns `false` for admin commands sent by non-admin
- [ ] Returns `true` for public commands sent by any user
- [ ] Handles missing sender metadata gracefully

### 3.3 Rate Limiter
- [ ] Allows requests under the limit
- [ ] Blocks requests over the limit
- [ ] Resets counter after window expires
- [ ] Per-user and per-group counters are independent

### 3.4 Media Processor
- [ ] Converts image to WebP sticker format
- [ ] Converts short video to animated sticker
- [ ] TTS returns valid OGG audio buffer
- [ ] Rejects files exceeding 50MB
- [ ] Temp files are deleted after processing

---

## 4) Integration Tests

### 4.1 Webhook Verification
- [ ] `GET /webhook` returns challenge with correct token
- [ ] `GET /webhook` returns 403 with wrong token
- [ ] `GET /webhook` returns 403 with missing token

### 4.2 Webhook Message Processing
- [ ] Valid POST payload triggers command handler
- [ ] Invalid signature returns 401
- [ ] Malformed JSON returns 400
- [ ] Unknown command returns help message
- [ ] Admin command from non-admin returns error message

### 4.3 Group Commands (Integration)
- [ ] `!kick` calls Meta API kick endpoint
- [ ] `!link` returns group invite link
- [ ] `!mute` sets group to admins-only messaging

### 4.4 Utility Commands (Integration)
- [ ] `!weather <city>` returns weather data
- [ ] `!translate en Hello` returns translation
- [ ] `!tts Hello` returns audio message

---

## 5) End-to-End Tests

### 5.1 Full Flow Test (Manual)
1. Send `!ping` → expect `Pong! Latency: XXms`
2. Send `!help` → expect command list
3. Send `!sticker` (reply to image) → expect sticker
4. Send `!tts Hello World` → expect voice note
5. Send `!weather Mumbai` → expect weather card
6. Admin sends `!mute` → expect group muted
7. Non-admin sends `!kick` → expect permission error

---

## 6) Load Tests

### 6.1 Concurrent Commands
- Simulate 50 concurrent `!ping` commands
- Expected: all respond within 2 seconds

### 6.2 Rate Limit Enforcement
- Simulate 20 commands/second from single user
- Expected: requests beyond limit receive 429 response

---

## 7) Regression Test Checklist
After each deployment, verify:
- [ ] `/health` returns 200
- [ ] `!ping` responds
- [ ] `!help` responds
- [ ] Webhook verification works
- [ ] At least one media command works (e.g., `!sticker`)

---

## 8) Test Data
- Test WhatsApp group: dedicated test group
- Test phone numbers: non-production numbers only
- No real user data in test environment
