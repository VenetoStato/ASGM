-- AlterTable
ALTER TABLE "Species" ADD COLUMN     "wikidataId" TEXT,
ADD COLUMN     "wikipediaTitle" TEXT,
ADD COLUMN     "sourceName" TEXT,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "imageAttribution" TEXT,
ADD COLUMN     "autoImported" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Species_wikidataId_key" ON "Species"("wikidataId");
