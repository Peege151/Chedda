-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BeatToTag" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BeatToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Beat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BeatToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_BeatToTag_AB_unique" ON "_BeatToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BeatToTag_B_index" ON "_BeatToTag"("B");
