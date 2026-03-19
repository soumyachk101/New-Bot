import { config } from '../../config/index.js';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const voiceMap: Record<string, string> = {
  'en': 'en-IN-NeerjaNeural',
  'hi': 'hi-IN-SwaraNeural',
  'mr': 'mr-IN-AarohiNeural',
};

export async function synthesizeSpeech(text: string, language: string): Promise<string | null> {
  const voice = voiceMap[language] ?? voiceMap['en'];
  
  try {
    const response = await axios.post(
      `https://${config.tts.azure.region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      `<speak version='1.0' xml:lang='${language}'><voice name='${voice}'>${text}</voice></speak>`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': config.tts.azure.key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        },
        responseType: 'arraybuffer'
      }
    );
    
    const fileName = `tts_${uuidv4()}.mp3`;
    const filePath = path.join('/tmp', fileName);
    
    await fs.writeFile(filePath, Buffer.from(response.data));
    
    return filePath;
  } catch (error) {
    console.error('Azure TTS error:', error);
    return null;
  }
}
