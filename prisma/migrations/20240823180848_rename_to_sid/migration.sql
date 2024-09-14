/*
  Warnings:

  - You are about to drop the column `session_id` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `sid` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "session_id",
ADD COLUMN     "sid" TEXT NOT NULL;
