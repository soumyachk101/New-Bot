import axios from 'axios';
import { config } from '../config/index.js';
import type { MetaSendMessagePayload } from '../types/index.js';

const apiUrl = `${config.meta.apiUrl}/${config.meta.phoneNumberId}/messages`;

export async function sendTextMessage(to: string, text: string): Promise<string | null> {
  try {
    const payload: MetaSendMessagePayload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    };
    
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${config.meta.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.messages?.[0]?.id ?? null;
  } catch (error) {
    console.error('Failed to send text message:', error);
    return null;
  }
}

export async function sendAudioMessage(to: string, audioId: string): Promise<string | null> {
  try {
    const payload: MetaSendMessagePayload = {
      messaging_product: 'whatsapp',
      to,
      type: 'audio',
      audio: { id: audioId }
    };
    
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${config.meta.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.messages?.[0]?.id ?? null;
  } catch (error) {
    console.error('Failed to send audio message:', error);
    return null;
  }
}

export async function sendImageMessage(to: string, imageId: string, caption?: string): Promise<string | null> {
  try {
    const payload: MetaSendMessagePayload = {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: { id: imageId }
    };
    
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${config.meta.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.messages?.[0]?.id ?? null;
  } catch (error) {
    console.error('Failed to send image message:', error);
    return null;
  }
}

export async function downloadMedia(mediaId: string): Promise<Buffer | null> {
  try {
    const mediaResponse = await axios.get(
      `${config.meta.apiUrl}/${mediaId}`,
      {
        headers: {
          'Authorization': `Bearer ${config.meta.accessToken}`
        }
      }
    );
    
    const mediaUrl = mediaResponse.data.url;
    
    const fileResponse = await axios.get(mediaUrl, {
      headers: {
        'Authorization': `Bearer ${config.meta.accessToken}`
      },
      responseType: 'arraybuffer'
    });
    
    return Buffer.from(fileResponse.data);
  } catch (error) {
    console.error('Failed to download media:', error);
    return null;
  }
}
