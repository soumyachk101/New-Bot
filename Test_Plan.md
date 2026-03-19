# Test Plan — WhatsApp Bot

---

## 1. Scope

This document covers unit, integration, and end-to-end tests for the WhatsApp Bot application.

---

## 2. Testing Levels

### 2.1 Unit Tests
- Framework: **Jest**
- Coverage target: **80%** line coverage
- Run: `npm run test:unit`

### 2.2 Integration Tests
- Framework: **Jest** + **Supertest**
- Test database: PostgreSQL (test instance)
- Run: `npm run test:integration`

### 2.3 End-to-End Tests
- Framework: **Jest** + Meta Test Phone Number
- Run: `npm run test:e2e`

---

## 3. Test Cases

### 3.1 Webhook

| TC-ID  | Description                                  | Expected Result        |
|--------|----------------------------------------------|------------------------|
| WH-001 | Valid signature — process message            | 200 OK, message queued |
| WH-002 | Invalid signature                            | 403 Forbidden          |
| WH-003 | Missing signature header                     | 403 Forbidden          |
| WH-004 | Verification challenge (GET)                 | 200 OK, echo challenge |
| WH-005 | Invalid verify token on GET                  | 403 Forbidden          |

---

### 3.2 Message Handling

| TC-ID  | Description                                  | Expected Result                      |
|--------|----------------------------------------------|--------------------------------------|
| MH-001 | Inbound text message from known user         | Reply sent                           |
| MH-002 | Inbound message from banned user             | Silently ignored                     |
| MH-003 | Inbound image message                        | Image downloaded, processed, replied |
| MH-004 | Inbound audio message                        | Audio transcoded, TTS reply sent     |
| MH-005 | Unknown message type                         | Graceful fallback reply              |

---

### 3.3 TTS

| TC-ID  | Description                                  | Expected Result                 |
|--------|----------------------------------------------|---------------------------------|
| TTS-001| Generate Hindi voice                         | OGG audio sent                  |
| TTS-002| Generate English voice                       | OGG audio sent                  |
| TTS-003| Generate Marathi voice                       | OGG audio sent                  |
| TTS-004| TTS provider unavailable                     | Error logged; text reply sent   |

---

### 3.4 Admin API

| TC-ID  | Description                                  | Expected Result            |
|--------|----------------------------------------------|----------------------------|
| AD-001 | Ban user (valid admin token)                 | 200 OK, user banned        |
| AD-002 | Ban user (unauthenticated)                   | 401 Unauthorized           |
| AD-003 | Unban user                                   | 200 OK, user unbanned      |
| AD-004 | Add admin (owner token)                      | 200 OK, admin added        |
| AD-005 | Add admin (non-owner token)                  | 403 Forbidden              |
| AD-006 | Remove admin                                 | 200 OK, admin removed      |

---

### 3.5 Broadcast

| TC-ID  | Description                                  | Expected Result             |
|--------|----------------------------------------------|-----------------------------|
| BC-001 | Schedule broadcast (admin token)             | 200 OK, broadcast queued    |
| BC-002 | Immediate broadcast to all users             | Messages sent               |
| BC-003 | Broadcast with invalid language code         | 400 Bad Request             |

---

### 3.6 Health Check

| TC-ID  | Description                                  | Expected Result             |
|--------|----------------------------------------------|-----------------------------|
| HC-001 | `GET /health` when services are up           | 200 OK, `{"status":"ok"}`   |

---

## 4. Test Data

- Test users: `+911111111111`, `+912222222222`
- Test admin: `+918145850111`
- Test banned user: `+913333333333`

---

## 5. CI Integration

Tests run automatically on every PR via GitHub Actions:

```yaml
- name: Run tests
  run: npm run test:unit && npm run test:integration
```

---

## 6. Coverage Report

Generate HTML coverage report:
```bash
npm run test:coverage
# Output: coverage/lcov-report/index.html
```
