/*
  Warnings:

  - A unique constraint covering the columns `[editUuid]` on the table `Developer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Developer" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "editUuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Developer_editUuid_key" ON "Developer"("editUuid");

-- CreateIndex
CREATE INDEX "Developer_editUuid_idx" ON "Developer"("editUuid");
