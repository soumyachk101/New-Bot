# Feature List — WhatsApp Bot

## 1) Group Management Features
| # | Feature | Command | Admin Only |
|---|---------|---------|------------|
| 1 | Kick participant | `!kick @user` | ✅ |
| 2 | Add participant | `!add <number>` | ✅ |
| 3 | Promote to admin | `!promote @user` | ✅ |
| 4 | Demote from admin | `!demote @user` | ✅ |
| 5 | Mute group | `!mute` | ✅ |
| 6 | Unmute group | `!unmute` | ✅ |
| 7 | Get invite link | `!link` | ✅ |
| 8 | Revoke invite link | `!revoke` | ✅ |
| 9 | Get group info | `!groupinfo` | ❌ |
| 10 | Tag all members | `!tagall` | ✅ |

---

## 2) Media Features
| # | Feature | Command | Admin Only |
|---|---------|---------|------------|
| 11 | Image to sticker | `!sticker` (reply image) | ❌ |
| 12 | Video to sticker (GIF) | `!sticker` (reply video) | ❌ |
| 13 | Sticker to image | `!toimage` (reply sticker) | ❌ |
| 14 | Audio converter | `!audio` (reply media) | ❌ |
| 15 | Download media from URL | `!dl <url>` | ❌ |
| 16 | YouTube audio download | `!ytmp3 <url>` | ❌ |
| 17 | YouTube video download | `!ytmp4 <url>` | ❌ |

---

## 3) Utility Features
| # | Feature | Command | Admin Only |
|---|---------|---------|------------|
| 18 | Text-to-speech | `!tts <text>` | ❌ |
| 19 | Language translation | `!translate <lang> <text>` | ❌ |
| 20 | Google search | `!search <query>` | ❌ |
| 21 | Wikipedia summary | `!wiki <query>` | ❌ |
| 22 | Weather info | `!weather <city>` | ❌ |
| 23 | Currency conversion | `!currency <amount> <from> <to>` | ❌ |
| 24 | QR code generator | `!qr <text>` | ❌ |
| 25 | Spell check | `!spell <text>` | ❌ |

---

## 4) Fun / Entertainment Features
| # | Feature | Command | Admin Only |
|---|---------|---------|------------|
| 26 | Random joke | `!joke` | ❌ |
| 27 | Random quote | `!quote` | ❌ |
| 28 | Coin flip | `!flip` | ❌ |
| 29 | Dice roll | `!dice` | ❌ |
| 30 | Random meme | `!meme` | ❌ |

---

## 5) Bot Management Features
| # | Feature | Command | Admin Only |
|---|---------|---------|------------|
| 31 | Help menu | `!help` | ❌ |
| 32 | Ping / latency | `!ping` | ❌ |
| 33 | Bot info | `!botinfo` | ❌ |
| 34 | Set language | `!setlang <lang>` | ✅ |
| 35 | Enable/disable commands | `!enable/!disable <cmd>` | ✅ |

---

## 6) Planned / Future Features
- Anti-link filter (auto-delete links from non-admins)
- Welcome/goodbye messages for members
- Poll creation and voting
- Scheduled messages
- AI chat integration (GPT)
- Image recognition / OCR
