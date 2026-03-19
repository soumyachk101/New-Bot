# Module-Wise TRD — WhatsApp Bot

---

## 1. Webhook Module

### Responsibility
Receive and validate all inbound events from Meta.

### Inputs
- `GET /webhook` — Meta verification challenge
- `POST /webhook` — Message events, status updates

### Processing
1. Validate HMAC-SHA256 signature using raw request body.
2. Parse Meta payload envelope.
3. Identify event type: `message`, `status`, `reaction`.
4. Route to appropriate handler.

### Outputs
- `200 OK` (always, to avoid Meta retries)
- Enqueued jobs for heavy processing

### Key Files
- `src/webhook/webhook.controller.ts`
- `src/webhook/webhook.service.ts`
- `src/webhook/webhook.validator.ts`

---

## 2. Message Handler Module

### Responsibility
Process inbound messages and determine the correct response strategy.

### Supported Message Types
| Type      | Action                                      |
|-----------|---------------------------------------------|
| text      | Parse command or echo reply                 |
| image     | Download, compress (Sharp), reply           |
| audio     | Download, transcode (FFmpeg), TTS reply     |
| video     | Download, transcode, reply                  |
| document  | Download, deliver link                      |
| sticker   | Acknowledge                                 |

### Key Files
- `src/messages/message.handler.ts`
- `src/messages/media.service.ts`

---

## 3. TTS Module

### Responsibility
Convert text to speech audio files for voice replies.

### Providers
| Provider        | Env Var            |
|-----------------|--------------------|
| Google Cloud TTS| `GOOGLE_TTS_KEY`   |
| Azure Cognitive | `AZURE_TTS_KEY`    |

### Processing
1. Accept text + language code.
2. Call TTS provider API.
3. Save output as `.ogg` (Opus codec).
4. Upload to Meta media endpoint.
5. Send audio message to user.

### Key Files
- `src/tts/tts.service.ts`
- `src/tts/providers/google.ts`
- `src/tts/providers/azure.ts`

---

## 4. User Management Module

### Responsibility
Track users, manage bans, and persist user preferences (language, etc.).

### Data Model
See `DB_Schema.md` → `users` table.

### Operations
- Auto-create user on first message.
- Ban / unban by admin.
- Update language preference.
- Check ban status before processing any message.

### Key Files
- `src/users/user.service.ts`
- `src/users/user.repository.ts`

---

## 5. Admin Module

### Responsibility
Admin and owner management; privilege enforcement.

### Roles
| Role   | Capabilities                                    |
|--------|-------------------------------------------------|
| Owner  | Add/remove admins, all admin capabilities       |
| Admin  | Ban/unban users, send broadcasts, manage groups |

### Key Files
- `src/admin/admin.service.ts`
- `src/admin/admin.guard.ts`

---

## 6. Broadcast Module

### Responsibility
Send messages to all or selected users/groups, immediately or on schedule.

### Processing
1. Admin creates broadcast via REST API.
2. If `scheduledAt` is provided, job is deferred.
3. BullMQ job iterates over target users and sends messages via Meta API.

### Key Files
- `src/broadcast/broadcast.service.ts`
- `src/broadcast/broadcast.job.ts`

---

## 7. Group Module

### Responsibility
Manage group-level bot behaviour.

### Operations
- Register group on first group message.
- Enable / disable bot per group.
- Admins can manage group settings via REST API.

### Key Files
- `src/groups/group.service.ts`
- `src/groups/group.repository.ts`

---

## 8. Media Module

### Responsibility
Download, process, and upload media files.

### Operations
1. Download media from Meta using signed URL.
2. Process with FFmpeg (audio) or Sharp (image).
3. Upload processed file to Meta.
4. Schedule deletion after 24 hours.

### Key Files
- `src/media/media.service.ts`
- `src/media/media.cleanup.job.ts`

---

## 9. Queue Module (BullMQ)

### Queues
| Queue Name | Purpose                 |
|------------|-------------------------|
| `tts`      | TTS synthesis jobs      |
| `media`    | Media processing jobs   |
| `broadcast`| Broadcast delivery jobs |

### Configuration
- Max retries: 3
- Back-off: exponential (2s, 4s, 8s)
- Concurrency per worker: 5

### Key Files
- `src/queue/queue.module.ts`
- `src/queue/processors/tts.processor.ts`
- `src/queue/processors/media.processor.ts`
- `src/queue/processors/broadcast.processor.ts`

---

## 10. Auth Module

### Responsibility
Issue and validate JWT tokens for admin/owner REST API access.

### Key Files
- `src/auth/auth.service.ts`
- `src/auth/jwt.strategy.ts`
- `src/auth/auth.guard.ts`
