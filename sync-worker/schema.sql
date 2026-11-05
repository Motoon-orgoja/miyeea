-- «الحلقات» tables. Once: npx wrangler d1 create mutoon-circles  (paste the id in wrangler.toml)
-- then: npx wrangler d1 execute mutoon-circles --remote --file schema.sql
CREATE TABLE IF NOT EXISTS circles (id TEXT PRIMARY KEY, name TEXT NOT NULL, owner TEXT NOT NULL, created INTEGER NOT NULL, cfg TEXT);
CREATE TABLE IF NOT EXISTS members (cid TEXT NOT NULL, mid TEXT NOT NULL, th TEXT NOT NULL, name TEXT NOT NULL, stat TEXT, at INTEGER, joined INTEGER, PRIMARY KEY (cid, mid));
CREATE TABLE IF NOT EXISTS subs (ep TEXT PRIMARY KEY, mid TEXT NOT NULL, th TEXT NOT NULL, p256dh TEXT NOT NULL, auth TEXT NOT NULL, at INTEGER, day TEXT, left INTEGER, rem INTEGER);
CREATE INDEX IF NOT EXISTS subs_mid ON subs(mid);
CREATE TABLE IF NOT EXISTS cheers (cid TEXT NOT NULL, tomid TEXT NOT NULL, frommid TEXT NOT NULL, fromname TEXT, kind TEXT NOT NULL, day TEXT NOT NULL, at INTEGER, seen INTEGER DEFAULT 0, PRIMARY KEY (cid, tomid, frommid, kind, day));
CREATE TABLE IF NOT EXISTS days (cid TEXT NOT NULL, mid TEXT NOT NULL, day TEXT NOT NULL, done INTEGER DEFAULT 0, tf INTEGER DEFAULT 0, mem INTEGER DEFAULT 0, bk TEXT, PRIMARY KEY (cid, mid, day));
