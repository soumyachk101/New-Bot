# Database Schema — WhatsApp Bot

## 1) Overview
Database: **PostgreSQL**
ORM: Prisma / Sequelize (choose one)

---

## 2) Tables

### 2.1 `users`
Stores per-user preferences and metadata.

```sql
CREATE TABLE users (
  id           SERIAL PRIMARY KEY,
  phone_hash   VARCHAR(64) UNIQUE NOT NULL,  -- hashed phone number
  language     VARCHAR(10) NOT NULL DEFAULT 'en',
  is_banned    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Auto-increment PK |
| `phone_hash` | VARCHAR(64) | SHA-256 hash of phone number |
| `language` | VARCHAR(10) | Preferred language code (e.g., `en`, `hi`) |
| `is_banned` | BOOLEAN | Whether user is banned from bot |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Record last update time |

---

### 2.2 `groups`
Stores per-group settings and configuration.

```sql
CREATE TABLE groups (
  id              SERIAL PRIMARY KEY,
  group_id        VARCHAR(128) UNIQUE NOT NULL,  -- WhatsApp group JID
  language        VARCHAR(10) NOT NULL DEFAULT 'en',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  welcome_msg     TEXT,
  goodbye_msg     TEXT,
  anti_link       BOOLEAN NOT NULL DEFAULT FALSE,
  tag_all_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Auto-increment PK |
| `group_id` | VARCHAR(128) | WhatsApp group JID |
| `language` | VARCHAR(10) | Group language preference |
| `is_active` | BOOLEAN | Whether bot is active in this group |
| `welcome_msg` | TEXT | Custom welcome message (nullable) |
| `goodbye_msg` | TEXT | Custom goodbye message (nullable) |
| `anti_link` | BOOLEAN | Enable anti-link filter |
| `tag_all_enabled` | BOOLEAN | Allow `!tagall` command |

---

### 2.3 `command_logs`
Minimal command audit log (no message content).

```sql
CREATE TABLE command_logs (
  id          SERIAL PRIMARY KEY,
  phone_hash  VARCHAR(64) NOT NULL,
  group_id    VARCHAR(128),
  command     VARCHAR(64) NOT NULL,
  status      VARCHAR(16) NOT NULL,  -- 'success' | 'error' | 'denied'
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Auto-increment PK |
| `phone_hash` | VARCHAR(64) | Hashed sender phone |
| `group_id` | VARCHAR(128) | Group JID (null for private) |
| `command` | VARCHAR(64) | Command name (e.g., `kick`) |
| `status` | VARCHAR(16) | Execution status |
| `created_at` | TIMESTAMP | When command was run |

---

### 2.4 `disabled_commands`
Tracks which commands are disabled per group.

```sql
CREATE TABLE disabled_commands (
  id        SERIAL PRIMARY KEY,
  group_id  VARCHAR(128) NOT NULL,
  command   VARCHAR(64) NOT NULL,
  UNIQUE(group_id, command)
);
```

---

## 3) Indexes

```sql
CREATE INDEX idx_users_phone_hash ON users(phone_hash);
CREATE INDEX idx_groups_group_id ON groups(group_id);
CREATE INDEX idx_command_logs_phone_hash ON command_logs(phone_hash);
CREATE INDEX idx_command_logs_created_at ON command_logs(created_at);
CREATE INDEX idx_disabled_commands_group_id ON disabled_commands(group_id);
```

---

## 4) Data Retention
- `command_logs`: auto-purge records older than **30 days**
- No message content is ever stored
- User records retained until explicit deletion request

---

## 5) Redis Schema

| Key Pattern | Type | TTL | Description |
|-------------|------|-----|-------------|
| `rl:user:{phone_hash}` | STRING (counter) | 10s | Per-user rate limit counter |
| `rl:group:{group_id}` | STRING (counter) | 10s | Per-group rate limit counter |
| `job:{job_id}` | HASH | 5min | Media job status/result |
| `session:{phone_hash}` | HASH | 30min | Temporary user session data |
