-- RenameTable
ALTER TABLE "person_profiles" RENAME TO "profiles";

-- AlterTable
ALTER TABLE "profiles" RENAME CONSTRAINT "person_profiles_pkey" TO "profiles_pkey";

-- AlterTable
ALTER TABLE "profiles" RENAME CONSTRAINT "person_profiles_user_id_fkey" TO "profiles_user_id_fkey";

