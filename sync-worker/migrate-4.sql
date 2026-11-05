-- circles that follow one text (2026-11-05): each day row keeps every text's count
--   npx wrangler d1 execute mutoon-circles --remote --file migrate-4.sql
ALTER TABLE days ADD COLUMN bk TEXT;
