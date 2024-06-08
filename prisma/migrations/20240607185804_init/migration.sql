-- CreateTable
CREATE TABLE "person_profile" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" VARCHAR(10) NOT NULL,

    CONSTRAINT "person_profile_pkey" PRIMARY KEY ("id")
);
