-- «الحلقات» v2 (2026-11-05): run once on the live database (schema.sql already has both for a new one)
--   npx wrangler d1 execute mutoon-circles --remote --file migrate-2.sql
ALTER TABLE circles ADD COLUMN cfg TEXT;
CREATE TABLE IF NOT EXISTS days (cid TEXT NOT NULL, mid TEXT NOT NULL, day TEXT NOT NULL, done INTEGER DEFAULT 0, tf INTEGER DEFAULT 0, mem INTEGER DEFAULT 0, PRIMARY KEY (cid, mid, day));
