-- Liberty Digital video insights: additive production migration.
-- Target: Supabase project defxhmtrhuqufalnjhjw (libertydigital's Project).
-- The release_backups schema is private and not exposed through the Data API.
-- This is a targeted before-change table snapshot, not a full database backup.
BEGIN;
CREATE SCHEMA IF NOT EXISTS release_backups;
REVOKE ALL ON SCHEMA release_backups FROM PUBLIC, anon, authenticated;
LOCK TABLE public."ContentDistribution" IN ACCESS EXCLUSIVE MODE;
CREATE TABLE IF NOT EXISTS release_backups."ContentDistribution_20261122" AS
  SELECT * FROM public."ContentDistribution";
REVOKE ALL ON TABLE release_backups."ContentDistribution_20261122" FROM PUBLIC, anon, authenticated;
ALTER TABLE public."ContentDistribution"
  ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "averageWatchSeconds" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "linkClicks" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "qualifiedInquiries" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "insightsRecordedAt" TIMESTAMP(3) WITHOUT TIME ZONE;
COMMIT;
