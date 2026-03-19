# Deployment — Railway.com

## 1) Services
Create **2 services** on Railway:

1. **web** (API + WhatsApp webhook)
2. **worker** (media processing / jobs)

Add **Redis** and **PostgreSQL** addons.

---

## 2) Environment Variables (Common)
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=postgresql://...`
- `REDIS_URL=redis://...`

---

## 3) WhatsApp Business API (Meta Cloud)
- `WABA_PHONE_NUMBER_ID=...`
- `WABA_BUSINESS_ACCOUNT_ID=...`
- `WABA_ACCESS_TOKEN=...`
- `WABA_WEBHOOK_VERIFY_TOKEN=...`

---

## 4) TTS Provider
(Choose one)
- `TTS_PROVIDER=google`
- `GOOGLE_TTS_KEY=...`

**OR**

- `TTS_PROVIDER=azure`
- `AZURE_TTS_KEY=...`
- `AZURE_TTS_REGION=...`

---

## 5) Media Tools
Ensure Railway image has:
- `ffmpeg`
- `sharp` (node native)

---

## 6) Build & Run

### web service
- Build: `npm install && npm run build`
- Start: `npm run start:web`

### worker service
- Build: `npm install && npm run build`
- Start: `npm run start:worker`

---

## 7) Webhook Setup
Set webhook URL in Meta:
```
https://<your-web-domain>/webhook
```

Set verify token to match `WABA_WEBHOOK_VERIFY_TOKEN`.

---

## 8) Database Migrations
Run after first deploy and after each schema change:
```bash
npx prisma migrate deploy
```

---

## 9) Health Check
Railway health check path:
```
GET /health
```
Expected response: `200 OK`

---

## 10) Owner Configuration
```
OwnerPhone: 8145850111
```
Set the owner phone number via environment variable:
```
OWNER_PHONE=8145850111
```
This number has full Owner-level privileges and is the fallback admin. **Never hardcode this value in source code.**

---

## 11) Scaling
- Scale **web** horizontally (stateless).
- Scale **worker** horizontally (BullMQ distributes jobs).
- Redis and PostgreSQL are shared Railway addons.

---

## 12) Rollback
To rollback to a previous deploy on Railway:
1. Open the service in Railway dashboard.
2. Go to **Deployments** tab.
3. Click **Rollback** on the desired previous deployment.
