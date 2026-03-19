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
https://<your-railway-domain>/webhook
```
Verify token must match `WABA_WEBHOOK_VERIFY_TOKEN`.

---

## 8) Health Check
- Endpoint: `GET /health`
- Expected: `200 OK`

---

## 9) Rollback
- Railway supports instant rollback via dashboard
- Keep last 3 deployments retained

---

## 10) Owner Info
- OwnerPhone: 8145850111
