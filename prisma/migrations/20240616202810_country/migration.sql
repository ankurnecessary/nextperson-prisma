-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- Inserting
INSERT INTO "Country" ("name") VALUES ('Australia');

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "countryId" INTEGER DEFAULT 1,
ALTER COLUMN "date_of_birth" SET DEFAULT NOW();

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
