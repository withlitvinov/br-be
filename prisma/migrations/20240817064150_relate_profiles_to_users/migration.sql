-- AlterTable
ALTER TABLE "person_profiles" ADD COLUMN     "user_id" UUID;

-- AddForeignKey
ALTER TABLE "person_profiles" ADD CONSTRAINT "person_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
