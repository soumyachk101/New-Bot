# API Specification — WhatsApp Bot

## 1) Webhook Endpoints

### 1.1 Webhook Verification
```
GET /webhook
```
**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `hub.mode` | string | Must be `subscribe` |
| `hub.verify_token` | string | Must match `WABA_WEBHOOK_VERIFY_TOKEN` |
| `hub.challenge` | string | Echo back to verify |

**Response:** `200 OK` with `hub.challenge` value as plain text.

---

### 1.2 Webhook Event Receiver
```
POST /webhook
```
**Headers:**
| Header | Value |
|--------|-------|
| `X-Hub-Signature-256` | HMAC-SHA256 signature |
| `Content-Type` | `application/json` |

**Request Body:** Meta Cloud API webhook payload (see Meta docs).

**Response:** `200 OK` (always, to acknowledge receipt)

---

## 2) Internal API Endpoints

### 2.1 Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2.2 Send Message (internal use)
```
POST /internal/send
```
**Request Body:**
```json
{
  "to": "91XXXXXXXXXX",
  "type": "text",
  "text": { "body": "Hello!" }
}
```
**Response:** `200 OK` with Meta API response.

---

## 3) Command API (WhatsApp Commands)

Commands are sent as WhatsApp text messages with prefix `!`.

| Command | Description | Admin Only |
|---------|-------------|------------|
| `!help` | Show all commands | No |
| `!kick @user` | Remove user from group | Yes |
| `!promote @user` | Promote user to admin | Yes |
| `!demote @user` | Demote user from admin | Yes |
| `!mute` | Mute group (admins only message) | Yes |
| `!unmute` | Unmute group | Yes |
| `!link` | Get group invite link | Yes |
| `!revoke` | Revoke group invite link | Yes |
| `!sticker` | Create sticker from replied media | No |
| `!tts <text>` | Text-to-speech | No |
| `!translate <lang> <text>` | Translate text | No |
| `!weather <city>` | Get weather info | No |
| `!currency <amount> <from> <to>` | Currency conversion | No |
| `!search <query>` | Google/Wikipedia search | No |
| `!ping` | Check bot latency | No |

---

## 4) Meta Cloud API Integration

### Send Text Message
```
POST https://graph.facebook.com/v17.0/{phone_number_id}/messages
Authorization: Bearer {WABA_ACCESS_TOKEN}
Content-Type: application/json
```
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "91XXXXXXXXXX",
  "type": "text",
  "text": { "body": "Hello!" }
}
```

---

## 5) Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request / invalid payload |
| 401 | Unauthorized (invalid token) |
| 403 | Forbidden (not admin) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
