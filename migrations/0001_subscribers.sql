-- conilab newsletter 订阅者表（D1 / SQLite）
-- 应用：
--   本地  wrangler d1 execute conilab-subscribers --local  --file migrations/0001_subscribers.sql
--   线上  wrangler d1 execute conilab-subscribers --remote --file migrations/0001_subscribers.sql

CREATE TABLE IF NOT EXISTS subscribers (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  email           TEXT NOT NULL UNIQUE,
  status          TEXT NOT NULL DEFAULT 'pending',   -- pending | confirmed | unsubscribed
  token           TEXT NOT NULL,                     -- 每订阅者一个随机句柄，确认 / 退订共用
  lang            TEXT NOT NULL DEFAULT 'zh',        -- zh | en，订阅时的语言偏好
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  confirmed_at    TEXT,
  unsubscribed_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_token  ON subscribers(token);
CREATE INDEX        IF NOT EXISTS idx_subscribers_status ON subscribers(status);
