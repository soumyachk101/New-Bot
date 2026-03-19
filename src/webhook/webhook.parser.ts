import type { WebhookEntry, WebhookMessage, MessageType } from '../types/index.js';

export function parseWebhookPayload(body: unknown): WebhookEntry | null {
  if (!body || typeof body !== 'object') {
    return null;
  }
  
  const payload = body as Record<string, unknown>;
  
  if (payload.object !== 'whatsapp_business_account') {
    return null;
  }
  
  return payload as unknown as WebhookEntry;
}

export function extractMessages(entry: WebhookEntry): WebhookMessage[] {
  const messages: WebhookMessage[] = [];
  
  for (const entryData of entry.entry) {
    for (const change of entryData.changes) {
      if (change.value.messaging) {
        for (const msg of change.value.messaging) {
          if (msg.type && isValidMessageType(msg.type)) {
            messages.push(msg as WebhookMessage);
          }
        }
      }
    }
  }
  
  return messages;
}

function isValidMessageType(type: string): type is MessageType {
  return ['text', 'image', 'audio', 'video', 'document', 'sticker'].includes(type);
}

export function getMessageText(msg: WebhookMessage): string | null {
  if (msg.type === 'text' && msg.text) {
    return msg.text.body;
  }
  return null;
}
