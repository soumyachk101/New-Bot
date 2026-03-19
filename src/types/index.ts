export type Role = 'owner' | 'admin' | 'user' | 'banned';
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker' | 'unknown';

export interface JwtPayload {
  phone: string;
  role: Role;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  phone: string;
  name?: string | null;
  language: string;
  banned: boolean;
  bannedBy?: string | null;
  bannedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: number;
  phone: string;
  name?: string | null;
  addedBy: string;
  createdAt: Date;
}

export interface Group {
  id: number;
  waGroupId: string;
  name?: string | null;
  botEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: number;
  waMsgId: string;
  senderPhone: string;
  groupId?: string | null;
  messageType: string;
  direction: string;
  status: string;
  createdAt: Date;
}

export interface Broadcast {
  id: number;
  message: string;
  language: string;
  createdBy: string;
  targetGroups: string[];
  scheduledAt?: Date | null;
  sentAt?: Date | null;
  status: string;
  createdAt: Date;
}

export interface Media {
  id: number;
  waMediaId: string;
  messageId?: number | null;
  mediaType: string;
  mimeType?: string | null;
  filePath?: string | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface WebhookConfig {
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookVerifyToken: string;
}

// Meta Webhook Types
export interface WebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: MessageType;
  text?: { body: string };
  image?: { id: string; caption?: string; mime_type: string };
  audio?: { id: string; mime_type: string };
  video?: { id: string; mime_type: string };
  document?: { id: string; filename: string; mime_type: string };
  sticker?: { id: string; mime_type: string };
}

export interface WebhookEntry {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messaging?: WebhookMessage[]; // User's code expects 'messaging'
        messages?: WebhookMessage[];  // Meta uses 'messages'
        statuses?: any[];
      };
      field: string;
    }>;
  }>;
}

export interface MetaSendMessagePayload {
  messaging_product: 'whatsapp';
  to: string;
  type: string;
  text?: { body: string };
  image?: { id: string; caption?: string };
  audio?: { id: string };
  video?: { id: string; caption?: string };
  document?: { id: string; filename?: string; caption?: string };
}
