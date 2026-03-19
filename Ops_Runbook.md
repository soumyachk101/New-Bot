# Operations Runbook — WhatsApp Bot

## 1) Overview
This runbook covers day-to-day operations, incident response, and maintenance procedures for the WhatsApp bot deployment on Railway.com.

- **SupportContact: 8145850111**

---

## 2) Services & URLs

| Service | URL / Endpoint |
|---------|---------------|
| Web (API) | `https://<railway-domain>/` |
| Health Check | `https://<railway-domain>/health` |
| Railway Dashboard | `https://railway.app/dashboard` |
| Meta Developer Console | `https://developers.facebook.com/` |

---

## 3) Routine Health Checks

### 3.1 Check Bot Health
```bash
curl https://<railway-domain>/health
# Expected: {"status":"ok",...}
```

### 3.2 Check Railway Service Status
- Go to Railway Dashboard → Select project → Check service logs

### 3.3 Check Redis
```bash
redis-cli -u $REDIS_URL ping
# Expected: PONG
```

### 3.4 Check PostgreSQL
```bash
psql $DATABASE_URL -c "SELECT 1;"
# Expected: 1 row
```

---

## 4) Common Incidents & Resolution

### 4.1 Bot Not Responding
**Symptoms:** Messages sent, no reply.

**Steps:**
1. Check Railway web service is running (not crashed)
2. Check Meta webhook logs in Developer Console
3. Verify `WABA_ACCESS_TOKEN` has not expired
4. Check `/health` endpoint
5. Restart web service if needed

---

### 4.2 Webhook Verification Failing
**Symptoms:** Meta shows webhook as unverified.

**Steps:**
1. Confirm `WABA_WEBHOOK_VERIFY_TOKEN` env var is set
2. Confirm webhook URL is publicly accessible
3. Test manually:
   ```bash
   curl "https://<domain>/webhook?hub.mode=subscribe&hub.verify_token=<token>&hub.challenge=test"
   # Expected: test
   ```

---

### 4.3 Media Processing Errors
**Symptoms:** Sticker/TTS commands failing.

**Steps:**
1. Check worker service logs for errors
2. Confirm `ffmpeg` is available in Railway image
3. Check temp disk space
4. Restart worker service

---

### 4.4 Rate Limit Hit
**Symptoms:** 429 errors in logs, Meta API errors.

**Steps:**
1. Check rate limit counters in Redis
2. Identify high-volume source (group or user)
3. Temporarily throttle or block that source
4. Wait for Meta rate limit window to reset (per-hour limits)

---

### 4.5 Database Connection Issues
**Symptoms:** DB errors in logs, commands not saving settings.

**Steps:**
1. Check `DATABASE_URL` env var
2. Check PostgreSQL service status in Railway
3. Run connection test
4. Restart web and worker services after DB recovery

---

## 5) Deployment Procedure
See `Deployment.md` for full setup.

**Quick redeploy:**
1. Push code to main branch
2. Railway auto-deploys via GitHub integration
3. Monitor deploy logs in Railway Dashboard
4. Verify `/health` after deploy

---

## 6) Rollback Procedure
1. Open Railway Dashboard
2. Navigate to service → Deployments
3. Select previous deployment
4. Click "Rollback"
5. Verify `/health` after rollback

---

## 7) Log Access
- Railway Dashboard → Service → Logs tab
- Filter by `ERROR` level for incidents
- Logs retained for 7 days (configurable)

---

## 8) Contacts & Escalation
| Role | Contact |
|------|---------|
| Owner / Primary Support | 8145850111 |
| Railway Support | https://railway.app/help |
| Meta API Support | https://developers.facebook.com/support |
