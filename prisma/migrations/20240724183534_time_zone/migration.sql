/*
  Warnings:

  - A unique constraint covering the columns `[config_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `config_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "config_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "user_configs" (
    "id" UUID NOT NULL,
    "time_zone" TEXT NOT NULL,

    CONSTRAINT "user_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_config_id_key" ON "users"("config_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "user_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
