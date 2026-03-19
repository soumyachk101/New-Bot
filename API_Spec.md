# API Specification — WhatsApp Bot

---

## Base URL
```
https://<your-railway-domain>/api/v1
```

---

## Authentication
All admin/owner endpoints require a Bearer token in the `Authorization` header.

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

---

### 1. Webhook

#### `GET /webhook`
Webhook verification challenge from Meta.

**Query params:**
| Param                 | Type   | Description                    |
|-----------------------|--------|--------------------------------|
| hub.mode              | string | Must be `subscribe`            |
| hub.verify_token      | string | Must match `WABA_WEBHOOK_VERIFY_TOKEN` |
| hub.challenge         | string | Echo back to Meta              |

**Responses:**
- `200 OK` — returns `hub.challenge`
- `403 Forbidden` — token mismatch

---

#### `POST /webhook`
Receives inbound messages and status updates from Meta.

**Headers:**
| Header                   | Value                  |
|--------------------------|------------------------|
| x-hub-signature-256      | `sha256=<hmac>`        |

**Body:** Meta webhook payload (JSON)

**Responses:**
- `200 OK` — always returned quickly; processing is async
- `403 Forbidden` — signature verification failed

---

### 2. Users

#### `GET /users`
Returns a paginated list of users.

**Query params:** `page`, `limit`

**Response:**
```json
{
  "data": [
    { "id": 1, "phone": "+911234567890", "name": "Alice", "banned": false }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

---

#### `POST /users/:phone/ban`
Ban a user by phone number.

**Auth:** Admin or Owner

**Response:**
```json
{ "success": true, "message": "User banned." }
```

---

#### `DELETE /users/:phone/ban`
Unban a user.

**Auth:** Admin or Owner

**Response:**
```json
{ "success": true, "message": "User unbanned." }
```

---

### 3. Admins

#### `GET /admins`
List all admins.

**Auth:** Owner only

---

#### `POST /admins`
Add a new admin.

**Auth:** Owner only

**Body:**
```json
{ "phone": "+911234567890", "name": "Bob" }
```

---

#### `DELETE /admins/:phone`
Remove an admin.

**Auth:** Owner only

---

### 4. Broadcast

#### `POST /broadcast`
Schedule a broadcast message.

**Auth:** Admin or Owner

**Body:**
```json
{
  "message": "Hello everyone!",
  "language": "en",
  "scheduledAt": "2025-01-01T10:00:00Z",
  "targetGroups": ["all"]
}
```

**Response:**
```json
{ "success": true, "broadcastId": "abc123" }
```

---

### 5. Groups

#### `GET /groups`
List registered groups.

**Auth:** Admin or Owner

---

#### `PATCH /groups/:groupId`
Enable or disable the bot in a group.

**Body:**
```json
{ "botEnabled": true }
```

---

### 6. Health

#### `GET /health`
Liveness check.

**Response:**
```json
{ "status": "ok", "timestamp": "2025-01-01T00:00:00Z" }
```

---

## Error Format

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing token."
  }
}
```

| HTTP Code | Code             | Meaning                      |
|-----------|------------------|------------------------------|
| 400       | BAD_REQUEST      | Invalid input                |
| 401       | UNAUTHORIZED     | Missing/invalid token        |
| 403       | FORBIDDEN        | Insufficient permissions     |
| 404       | NOT_FOUND        | Resource not found           |
| 429       | RATE_LIMITED     | Too many requests            |
| 500       | INTERNAL_ERROR   | Server error                 |
