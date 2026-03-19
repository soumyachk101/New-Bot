# Localization Guide — WhatsApp Bot

## 1) Overview
The bot supports multiple languages for responses. Language files are JSON key-value maps stored in `src/locales/`.

---

## 2) Supported Languages

| Code | Language | Status |
|------|----------|--------|
| `en` | English | ✅ Complete (default) |
| `hi` | Hindi | 🔄 In Progress |
| `mr` | Marathi | 📋 Planned |
| `es` | Spanish | 📋 Planned |
| `pt` | Portuguese | 📋 Planned |
| `ar` | Arabic | 📋 Planned |

---

## 3) File Structure

```
src/
  locales/
    en.json      ← English (default, always complete)
    hi.json      ← Hindi
    mr.json      ← Marathi
    es.json      ← Spanish
    ...
```

---

## 4) JSON Format

Each locale file is a flat or nested JSON object:

```json
{
  "general": {
    "error": "An error occurred. Please try again.",
    "permission_denied": "You don't have permission to use this command.",
    "rate_limited": "Slow down! Too many commands. Please wait a moment.",
    "unknown_command": "Unknown command. Type !help to see available commands."
  },
  "help": {
    "title": "📋 *Available Commands*",
    "footer": "Commands marked 🔒 require admin."
  },
  "ping": {
    "response": "🏓 Pong! Latency: {latency}ms"
  },
  "kick": {
    "success": "✅ @{user} has been removed from the group.",
    "not_admin": "❌ I need to be an admin to kick members.",
    "self_kick": "❌ I cannot kick myself."
  },
  "sticker": {
    "processing": "⏳ Creating sticker...",
    "success": "✅ Here is your sticker!",
    "too_large": "❌ File too large. Max size is 50MB.",
    "no_media": "❌ Please reply to an image or video."
  },
  "tts": {
    "processing": "⏳ Generating voice note...",
    "success": "🔊 Here is your voice note!",
    "too_long": "❌ Text too long. Max 500 characters.",
    "empty": "❌ Please provide text. Usage: !tts Hello World"
  },
  "mute": {
    "success": "🔇 Group has been muted.",
    "already_muted": "Group is already muted."
  },
  "unmute": {
    "success": "🔊 Group has been unmuted.",
    "already_unmuted": "Group is already unmuted."
  }
}
```

---

## 5) Variable Interpolation
Use `{variableName}` placeholders in strings for dynamic values:
```json
"kick_success": "✅ @{user} has been removed from the group."
```
In code:
```js
t('kick.success', { user: participant.name })
```

---

## 6) Translation Function
```js
// src/i18n.js
function t(key, vars = {}, lang = 'en') {
  const strings = loadLocale(lang);
  let str = getNestedKey(strings, key) || getNestedKey(loadLocale('en'), key) || key;
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}
```

---

## 7) Setting Language

### Per Group (Admin Only)
```
!setlang hi
```
Stores language in `groups.language` column.

### Per User
```
!mylang hi
```
Stores language in `users.language` column (overrides group setting).

---

## 8) Priority Order
1. User's personal language preference (`users.language`)
2. Group language setting (`groups.language`)
3. Default: `en`

---

## 9) Adding a New Language

1. Copy `src/locales/en.json` to `src/locales/<code>.json`
2. Translate all values (keep keys identical)
3. Add language code to supported languages list in `src/i18n.js`
4. Submit PR with translation

---

## 10) Translation Completeness Check
Run during CI:
```bash
npm run check:locales
# Checks all keys in en.json exist in all other locale files
```
Missing keys fall back to English automatically.

---

## 11) Language Codes Reference
Use standard **BCP 47** language codes:
- `en` — English
- `hi` — Hindi
- `mr` — Marathi
- `es` — Spanish
- `pt` — Portuguese (Brazil: `pt-BR`)
- `ar` — Arabic
- `fr` — French
- `de` — German
