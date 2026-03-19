# Database Schema — WhatsApp Bot

---

## ORM: Prisma
## Database: PostgreSQL 15

---

## Tables

### users
Stores all WhatsApp users who have interacted with the bot.

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  phone       VARCHAR(20)  NOT NULL UNIQUE,  -- E.164 format
  name        VARCHAR(100),
  language    VARCHAR(10)  NOT NULL DEFAULT 'en',  -- en | hi | mr
  banned      BOOLEAN      NOT NULL DEFAULT FALSE,
  banned_by   VARCHAR(20),                  -- admin phone
  banned_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

---

### admins
Stores admin phone numbers.

```sql
CREATE TABLE admins (
  id          SERIAL PRIMARY KEY,
  phone       VARCHAR(20)  NOT NULL UNIQUE,
  name        VARCHAR(100),
  added_by    VARCHAR(20)  NOT NULL,         -- owner phone
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

---

### groups
Stores WhatsApp group information.

```sql
CREATE TABLE groups (
  id           SERIAL PRIMARY KEY,
  wa_group_id  VARCHAR(100) NOT NULL UNIQUE, -- WhatsApp group JID
  name         VARCHAR(200),
  bot_enabled  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

---

### messages
Audit log of processed messages.

```sql
CREATE TABLE messages (
  id           SERIAL PRIMARY KEY,
  wa_msg_id    VARCHAR(100) NOT NULL UNIQUE, -- WhatsApp message ID
  sender_phone VARCHAR(20)  NOT NULL,
  group_id     VARCHAR(100),                 -- NULL for 1:1 messages
  message_type VARCHAR(30)  NOT NULL,        -- text|image|audio|video|document|sticker
  direction    VARCHAR(10)  NOT NULL,        -- inbound|outbound
  status       VARCHAR(20)  NOT NULL DEFAULT 'pending',
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

---

### broadcasts
Stores scheduled and sent broadcast messages.

```sql
CREATE TABLE broadcasts (
  id            SERIAL PRIMARY KEY,
  message       TEXT         NOT NULL,
  language      VARCHAR(10)  NOT NULL DEFAULT 'en',
  created_by    VARCHAR(20)  NOT NULL,        -- admin phone
  target_groups TEXT[],                       -- NULL = all users
  scheduled_at  TIMESTAMPTZ,
  sent_at       TIMESTAMPTZ,
  status        VARCHAR(20)  NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

---

### media
Tracks temporary media files.

```sql
CREATE TABLE media (
  id            SERIAL PRIMARY KEY,
  wa_media_id   VARCHAR(100) NOT NULL UNIQUE,
  message_id    INTEGER REFERENCES messages(id),
  media_type    VARCHAR(30)  NOT NULL,        -- image|audio|video|document
  mime_type     VARCHAR(100),
  file_path     VARCHAR(500),
  expires_at    TIMESTAMPTZ  NOT NULL,        -- NOW() + INTERVAL '24 hours'
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

---

## Indexes

```sql
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_messages_sender ON messages(sender_phone);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_broadcasts_status ON broadcasts(status);
CREATE INDEX idx_media_expires_at ON media(expires_at);
```

---

## Prisma Schema (excerpt)

```prisma
model User {
  id        Int       @id @default(autoincrement())
  phone     String    @unique
  name      String?
  language  String    @default("en")
  banned    Boolean   @default(false)
  bannedBy  String?
  bannedAt  DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Admin {
  id        Int      @id @default(autoincrement())
  phone     String   @unique
  name      String?
  addedBy   String
  createdAt DateTime @default(now())
}
```
