import type { WebhookMessage } from '../types/index.js';
import { getOrCreateUser, isUserBanned, setUserLanguage } from '../users/user.service.js';
import { sendTextMessage } from '../webhook/meta.api.js';
import { t } from '../locales/index.js';
import { config } from '../config/index.js';

export async function handleIncomingMessage(msg: WebhookMessage): Promise<void> {
  const senderPhone = msg.from;
  
  if (senderPhone === config.meta.phoneNumberId) {
    return;
  }
  
  const user = await getOrCreateUser(senderPhone);
  
  if (user.banned) {
    return;
  }
  
  const language = user.language || 'en';
  
  switch (msg.type) {
    case 'text':
      await handleTextMessage(msg, language);
      break;
    case 'image':
      await handleMediaMessage(msg, language, 'image');
      break;
    case 'audio':
      await handleMediaMessage(msg, language, 'audio');
      break;
    case 'video':
      await handleMediaMessage(msg, language, 'video');
      break;
    case 'document':
      await handleMediaMessage(msg, language, 'document');
      break;
    case 'sticker':
      await handleStickerMessage(msg, language);
      break;
    default:
      await sendTextMessage(senderPhone, t('unknown_command', language));
  }
}

async function handleTextMessage(msg: WebhookMessage, language: string): Promise<void> {
  const text = msg.text?.body?.trim().toLowerCase();
  const senderPhone = msg.from;
  
  if (!text) return;
  
  if (text.startsWith('!lang ')) {
    const lang = text.substring(6).trim();
    if (['en', 'hi', 'mr'].includes(lang)) {
      await updateUserLanguage(senderPhone, lang);
      await sendTextMessage(senderPhone, t('language_changed', lang));
    }
    return;
  }
  
  if (text === '!help') {
    await sendHelpMessage(senderPhone, language);
    return;
  }
  
  if (text === '!start' || text === 'hi' || text === 'hello') {
    await sendTextMessage(senderPhone, t('welcome', language));
    return;
  }
  
  await sendTextMessage(senderPhone, t('unknown_command', language));
}

async function handleMediaMessage(msg: WebhookMessage, language: string, mediaType: string): Promise<void> {
  const senderPhone = msg.from;
  await sendTextMessage(senderPhone, t('media_received', language, { type: mediaType }));
}

async function handleStickerMessage(msg: WebhookMessage, language: string): Promise<void> {
  const senderPhone = msg.from;
  await sendTextMessage(senderPhone, 'Nice sticker! 🎨');
}

async function sendHelpMessage(phone: string, language: string): Promise<void> {
  const helpText = `
Available commands:
!start - Start conversation
!lang <en|hi|mr> - Change language
!help - Show this help
  `.trim();
  
  await sendTextMessage(phone, helpText);
}

async function updateUserLanguage(phone: string, language: string): Promise<void> {
  await setUserLanguage(phone, language);
}
