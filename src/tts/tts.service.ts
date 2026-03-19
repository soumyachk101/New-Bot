import { config } from '../config/index.js';
import * as googleTts from './providers/google.js';
import * as azureTts from './providers/azure.js';

export async function generateTTS(text: string, language: string): Promise<string | null> {
  if (config.tts.provider === 'google') {
    return googleTts.synthesizeSpeech(text, language);
  } else {
    return azureTts.synthesizeSpeech(text, language);
  }
}
