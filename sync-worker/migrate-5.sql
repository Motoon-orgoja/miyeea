-- circles: points an admin gives (heard recitations, by hand) (2026-11-07)
--   npx wrangler d1 execute mutoon-circles --remote --file migrate-5.sql
CREATE TABLE IF NOT EXISTS bonus (cid TEXT NOT NULL, mid TEXT NOT NULL, day TEXT NOT NULL, pts INTEGER NOT NULL, kind TEXT, grade TEXT, why TEXT, byname TEXT, at INTEGER);
CREATE INDEX IF NOT EXISTS bonus_cid ON bonus(cid, day);
