import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { config } from '../../config/index.js';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const client = new TextToSpeechClient();

const voiceMap: Record<string, { languageCode: string; name: string }> = {
  'en': { languageCode: 'en-IN', name: 'en-IN-Standard-A' },
  'hi': { languageCode: 'hi-IN', name: 'hi-IN-Standard-A' },
  'mr': { languageCode: 'mr-IN', name: 'mr-IN-Standard-A' },
};

export async function synthesizeSpeech(text: string, language: string): Promise<string | null> {
  const voice = voiceMap[language] ?? voiceMap['en'];
  
  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: voice.languageCode,
        name: voice.name,
      },
      audioConfig: {
        audioEncoding: 'OGG_OPUS',
      },
    });
    
    if (!response.audioContent) {
      return null;
    }
    
    const fileName = `tts_${uuidv4()}.ogg`;
    const filePath = path.join('/tmp', fileName);
    
    await fs.writeFile(filePath, response.audioContent as Uint8Array);
    
    return filePath;
  } catch (error) {
    console.error('Google TTS error:', error);
    return null;
  }
}
