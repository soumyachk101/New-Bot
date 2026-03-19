# Security — WhatsApp Bot

---

## 1. Access Control

### Roles

| Role         | Description                                           |
|--------------|-------------------------------------------------------|
| **Owner**    | Full control — add/remove admins, all admin actions   |
| **Admin**    | Ban/unban users, send broadcasts, manage groups       |
| **User**     | Interact with the bot (send/receive messages)         |
| **Banned**   | Blocked; all messages silently ignored                |

### Primary Admin / Owner
```
PrimaryAdmin: 8145850111
```

All privilege-escalation requests are validated against this number. The owner number is set via environment variable and must **never** be hardcoded in source code.

---

## 2. Webhook Security

- All incoming POST `/webhook` requests are validated using **HMAC-SHA256**.
- The signature is read from the `x-hub-signature-256` header.
- Requests with missing or invalid signatures return `403 Forbidden` immediately.
- Verification uses a constant-time comparison to prevent timing attacks.

```
Expected: sha256=HMAC(secret, rawBody)
```

---

## 3. API Authentication

- Admin and owner REST endpoints require a **JWT Bearer token**.
- Tokens are signed with `HS256` and expire in **1 hour**.
- Refresh tokens have a **7-day** TTL and are stored in Redis.
- Tokens are invalidated on logout or admin removal.

---

## 4. Input Validation

- All REST API inputs are validated with **Zod** schemas before processing.
- Phone numbers must match E.164 format (`^\+[1-9]\d{1,14}$`).
- Message content is sanitised before storage to prevent SQL injection and XSS.

---

## 5. Secrets Management

- All secrets (tokens, keys, DB URLs) are stored in **environment variables**.
- No secrets are committed to source control.
- A `.env.example` file documents required keys without values.
- Railway secrets store is used in production.

---

## 6. Data Protection

- Passwords are hashed with **bcrypt** (cost factor 12).
- Sensitive user data (phone numbers) are stored only in the database; not logged.
- Temporary media files are deleted after **24 hours**.
- Database connections use SSL in production (`?sslmode=require`).

---

## 7. Transport Security

- All external communication is over **HTTPS/TLS 1.2+**.
- HTTP is redirected to HTTPS.
- HSTS header is set (`max-age=63072000; includeSubDomains`).

---

## 8. Rate Limiting

- Webhook endpoint: **100 requests/min per IP**.
- REST API: **60 requests/min per authenticated user**.
- Responses return `429 Too Many Requests` when limits are exceeded.

---

## 9. Logging & Audit

- All admin and owner actions are logged with timestamp, actor phone, action, and target.
- Logs are written to stdout in JSON format and captured by Railway.
- Log entries do not contain raw message content or credentials.

---

## 10. Dependency Security

- `npm audit` is run as part of every CI pipeline.
- Dependabot is enabled to auto-raise PRs for security patches.
- Only production dependencies are installed in the Docker/Railway image.
