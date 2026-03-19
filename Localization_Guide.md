# Localization Guide — WhatsApp Bot

---

## 1. Supported Languages

| Language | Code | Locale   |
|----------|------|----------|
| English  | `en` | `en-IN`  |
| Hindi    | `hi` | `hi-IN`  |
| Marathi  | `mr` | `mr-IN`  |

---

## 2. Translation File Structure

All translations are stored in `src/locales/` as JSON files:

```
src/
  locales/
    en.json
    hi.json
    mr.json
```

### Example: `en.json`
```json
{
  "welcome": "Welcome! How can I help you?",
  "banned": "You are not allowed to use this service.",
  "media_received": "I received your {{type}}. Processing...",
  "tts_error": "Sorry, I could not generate a voice response right now.",
  "admin_required": "This action requires admin privileges.",
  "ban_success": "User {{phone}} has been banned.",
  "unban_success": "User {{phone}} has been unbanned.",
  "broadcast_queued": "Broadcast scheduled successfully.",
  "unknown_command": "Sorry, I did not understand that. Please try again."
}
```

### Example: `hi.json`
```json
{
  "welcome": "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",
  "banned": "आपको यह सेवा उपयोग करने की अनुमति नहीं है।",
  "media_received": "मुझे आपका {{type}} मिला। प्रोसेसिंग हो रही है...",
  "tts_error": "क्षमा करें, अभी वॉयस रिस्पॉन्स नहीं बना सका।",
  "admin_required": "इस कार्य के लिए एडमिन अधिकार आवश्यक हैं।",
  "ban_success": "यूज़र {{phone}} को बैन कर दिया गया है।",
  "unban_success": "यूज़र {{phone}} का बैन हटा दिया गया है।",
  "broadcast_queued": "ब्रॉडकास्ट सफलतापूर्वक शेड्यूल किया गया।",
  "unknown_command": "क्षमा करें, मैं यह समझ नहीं पाया। कृपया पुनः प्रयास करें।"
}
```

### Example: `mr.json`
```json
{
  "welcome": "नमस्कार! मी तुम्हाला कशी मदत करू शकतो?",
  "banned": "तुम्हाला ही सेवा वापरण्याची परवानगी नाही.",
  "media_received": "मला तुमचा {{type}} मिळाला. प्रक्रिया सुरू आहे...",
  "tts_error": "माफ करा, आत्ता व्हॉइस रिस्पॉन्स तयार करता आला नाही.",
  "admin_required": "या कृतीसाठी प्रशासक अधिकार आवश्यक आहेत.",
  "ban_success": "वापरकर्ता {{phone}} वर बंदी घालण्यात आली आहे.",
  "unban_success": "वापरकर्ता {{phone}} वरील बंदी उठवण्यात आली आहे.",
  "broadcast_queued": "ब्रॉडकास्ट यशस्वीरीत्या शेड्यूल केला.",
  "unknown_command": "माफ करा, मला ते समजले नाही. कृपया पुन्हा प्रयत्न करा."
}
```

---

## 3. Usage in Code

### Helper function
```typescript
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';

const translations: Record<string, Record<string, string>> = { en, hi, mr };

export function t(key: string, lang: string, vars?: Record<string, string>): string {
  const locale = translations[lang] ?? translations['en'];
  let text = locale[key] ?? en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{{${k}}}`, v);
    }
  }
  return text;
}
```

### Example usage
```typescript
const reply = t('welcome', user.language);
const banMsg = t('ban_success', admin.language, { phone: '+911234567890' });
```

---

## 4. Adding a New Language

1. Create `src/locales/<code>.json` with all keys translated.
2. Add the language code and locale to the supported languages table above.
3. Import the new JSON file in the `t()` helper.
4. Add the TTS voice name for the new language in `src/tts/tts.service.ts`.
5. Update `Feature_List.md` to reflect the new language.

---

## 5. TTS Voice Mapping

| Language | Google Voice         | Azure Voice           |
|----------|----------------------|-----------------------|
| English  | `en-IN-Standard-A`   | `en-IN-NeerjaNeural`  |
| Hindi    | `hi-IN-Standard-A`   | `hi-IN-SwaraNeural`   |
| Marathi  | `mr-IN-Standard-A`   | `mr-IN-AarohiNeural`  |

---

## 6. User Language Preference

- Default language: `en`.
- Users can change their language by sending a command: e.g., `!lang hi`.
- Language preference is stored in the `users.language` column.
- All subsequent replies use the user's preferred language.
