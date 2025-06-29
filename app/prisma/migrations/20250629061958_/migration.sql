/*
  Warnings:

  - You are about to drop the column `extractedId` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Stream` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,streamId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "extractedId",
DROP COLUMN "url";

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_streamId_key" ON "Upvote"("userId", "streamId");
