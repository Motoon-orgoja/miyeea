-- the daily reminder (2026-11-05): run once on the live database
--   npx wrangler d1 execute mutoon-circles --remote --file migrate-3.sql
ALTER TABLE subs ADD COLUMN day TEXT;
ALTER TABLE subs ADD COLUMN left INTEGER;
ALTER TABLE subs ADD COLUMN rem INTEGER;
