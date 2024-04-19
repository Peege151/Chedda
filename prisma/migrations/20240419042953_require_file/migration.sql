/*
  Warnings:

  - Made the column `file` on table `Beat` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "bpm" TEXT NOT NULL,
    "file" TEXT NOT NULL
);
INSERT INTO "new_Beat" ("bpm", "file", "id", "title") SELECT "bpm", "file", "id", "title" FROM "Beat";
DROP TABLE "Beat";
ALTER TABLE "new_Beat" RENAME TO "Beat";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
