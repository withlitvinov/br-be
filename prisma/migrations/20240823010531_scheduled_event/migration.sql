-- CreateTable
CREATE TABLE "scheduled_events" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "startAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP,

    CONSTRAINT "scheduled_events_pkey" PRIMARY KEY ("id")
);
