/*
  Warnings:

  - You are about to drop the column `addedBy` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `bigImg` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `played` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `playedTs` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `smallImg` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CurrentStream` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Space` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CurrentStream" DROP CONSTRAINT "CurrentStream_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "CurrentStream" DROP CONSTRAINT "CurrentStream_streamId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_addedBy_fkey";

-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_spaceId_fkey";

-- DropIndex
DROP INDEX "Upvote_userId_streamId_key";

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "addedBy",
DROP COLUMN "bigImg",
DROP COLUMN "createAt",
DROP COLUMN "played",
DROP COLUMN "playedTs",
DROP COLUMN "smallImg",
DROP COLUMN "spaceId",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "password",
ADD COLUMN     "role" "Role" NOT NULL;

-- DropTable
DROP TABLE "CurrentStream";

-- DropTable
DROP TABLE "Space";
