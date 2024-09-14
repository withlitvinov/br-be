/*
  Warnings:

  - You are about to drop the column `expires_in` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `expire_at` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "expires_in",
DROP COLUMN "refresh_token",
ADD COLUMN     "expire_at" TIMESTAMP NOT NULL,
ADD COLUMN     "session_id" TEXT NOT NULL;
