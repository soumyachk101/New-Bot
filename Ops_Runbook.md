# Operations Runbook — WhatsApp Bot

---

## Support Contact
```
SupportContact: 8145850111
```

---

## 1. Service Overview

| Service  | Purpose                        | Platform   |
|----------|--------------------------------|------------|
| web      | Webhook + REST API             | Railway    |
| worker   | TTS, media processing, jobs    | Railway    |
| postgres | Persistent data store          | Railway    |
| redis    | Cache + job queue              | Railway    |

---

## 2. Health Checks

### Check web service
```bash
curl https://<your-web-domain>/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Check worker queue depth
```bash
# Connect to Redis and inspect queue lengths
redis-cli -u $REDIS_URL LLEN bull:tts:wait
redis-cli -u $REDIS_URL LLEN bull:media:wait
```

---

## 3. Common Incidents

### 3.1 Bot not responding to messages

**Symptoms:** Users send messages but receive no reply.

**Checklist:**
1. Check Railway web service logs for errors.
2. Verify `WABA_ACCESS_TOKEN` is valid (tokens expire — regenerate in Meta portal).
3. Check webhook is registered and active in Meta Business Suite.
4. Verify PostgreSQL connection: check `DATABASE_URL`.
5. Check if user is banned (`SELECT * FROM users WHERE phone='...' AND banned=true`).

---

### 3.2 TTS not working

**Symptoms:** Voice messages not sent; users receive no audio reply.

**Checklist:**
1. Check worker service logs for TTS errors.
2. Verify `TTS_PROVIDER`, `GOOGLE_TTS_KEY` or `AZURE_TTS_KEY` env vars are set.
3. Check Redis connection; BullMQ jobs may be stuck.
4. Check dead-letter queue for failed jobs.

---

### 3.3 High queue depth

**Symptoms:** Responses are delayed; queue depth keeps growing.

**Resolution:**
1. Scale up the **worker** service on Railway (add replicas).
2. Check for a specific job type causing failures (inspect BullMQ dashboard).
3. Clear stuck jobs if necessary:
```bash
redis-cli -u $REDIS_URL DEL bull:tts:stalled
```

---

### 3.4 Database connection errors

**Symptoms:** `Error: P1001: Can't reach database server`.

**Checklist:**
1. Check Railway PostgreSQL addon status.
2. Verify `DATABASE_URL` includes `?sslmode=require`.
3. Restart the web and worker services on Railway.

---

### 3.5 Webhook signature failures

**Symptoms:** `403 Forbidden` on all incoming webhooks; no messages processed.

**Resolution:**
1. Verify `WABA_WEBHOOK_VERIFY_TOKEN` matches the token configured in Meta.
2. Ensure the raw request body is used for HMAC computation (no body-parser interference).

---

## 4. Log Access

Railway logs are available in the Railway dashboard under each service → **Logs** tab.

To filter logs:
- Search for `"level":"error"` to see errors only.
- Search for a specific phone number to trace a user's messages.

---

## 5. Backup & Recovery

### Database backup
Railway PostgreSQL addons support point-in-time recovery. Enable daily backups in the addon settings.

Manual backup:
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
psql $DATABASE_URL < backup_20250101.sql
```

---

## 6. Deployment Procedure

1. Merge PR to `main` branch.
2. GitHub Actions CI runs (lint + tests).
3. Railway auto-deploys on push to `main`.
4. Run database migrations if schema changed:
```bash
npx prisma migrate deploy
```
5. Monitor Railway logs for 5 minutes post-deploy.

---

## 7. Escalation

If the issue cannot be resolved within 30 minutes, escalate to:
```
SupportContact: 8145850111
```
