# Security & Permissions — WhatsApp Bot

## 1) Admin Controls
- Group admin commands **sirf admins** use kar sakte hain.
- Bot must be **admin** for actions like kick/promote/mute/link.

## 2) Authorization Rules
- **Group context**: admin‑only commands enforce
- **Private chat**: no admin enforcement needed
- Maintain allowlist for owner‑only commands (future)

## 3) Rate Limits / Anti‑Spam
- Per‑user limit (e.g., 5 commands / 10 sec)
- Per‑group burst limit
- Auto mute spammy users (configurable)

## 4) Media Safety
- Max size: **50MB**
- Auto‑delete immediately after delivery
- No permanent media storage
- Temporary files in secure temp directory

## 5) Data Minimization
- Store only:
  - user id (phone hash)
  - language preference
  - group settings
- No message content stored (unless needed for logs)

## 6) Audit Logs
- Minimal logs for errors, not full content
- Keep logs for limited time only

## 7) Secret Management
- Use Railway environment secrets
- No secrets in code or repo

## 8) Compliance
- WhatsApp Business API policy compliance
- Only respond to user‑initiated messages
- No spam or unsolicited outbound messages

## 9) Primary Admin
- PrimaryAdmin: 8145850111
