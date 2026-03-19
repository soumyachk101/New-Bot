import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  meta: {
    apiUrl: 'https://graph.facebook.com/v20.0', // Updated to v20.0 as per documentation implied versions
    phoneNumberId: process.env.WABA_PHONE_NUMBER_ID,
    businessAccountId: process.env.WABA_BUSINESS_ACCOUNT_ID,
    accessToken: process.env.WABA_ACCESS_TOKEN,
    webhookVerifyToken: process.env.WABA_WEBHOOK_VERIFY_TOKEN,
  },

  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'supersecretchangeit',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'evenmoresecretchangeit',
    },
    refreshExpire: '7d',
    accessExpire: '1h',
  },

  tts: {
    provider: process.env.TTS_PROVIDER || 'google',
    google: {
      key: process.env.GOOGLE_TTS_KEY,
    },
    azure: {
      key: process.env.AZURE_TTS_KEY,
      region: process.env.AZURE_TTS_REGION,
    },
  },

  owner: {
    phone: process.env.OWNER_PHONE || '8145850111',
  },

  rateLimit: {
    webhook: {
      windowMs: 60 * 1000, // 1 minute
      max: 100,
    },
    api: {
      windowMs: 60 * 1000, // 1 minute
      max: 60,
    },
  },

  media: {
    tempPath: './temp/media',
    expiryHours: 24,
  },
};
