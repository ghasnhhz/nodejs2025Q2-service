/*
  Warnings:

  - You are about to drop the column `userId` on the `Favorites` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_userId_fkey";

-- DropIndex
DROP INDEX "Favorites_userId_key";

-- AlterTable
ALTER TABLE "Favorites" DROP COLUMN "userId";
