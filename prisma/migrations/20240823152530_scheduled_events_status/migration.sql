-- AlterTable
ALTER TABLE "scheduled_events" ADD COLUMN "status" INTEGER;

UPDATE "scheduled_events" SET "status" = 0;

ALTER TABLE "scheduled_events" ALTER COLUMN "status" SET NOT NULL;
