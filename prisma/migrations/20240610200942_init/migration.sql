-- CreateTable
CREATE TABLE "person_profiles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TIMESTAMP NOT NULL,

    CONSTRAINT "person_profiles_pkey" PRIMARY KEY ("id")
);
