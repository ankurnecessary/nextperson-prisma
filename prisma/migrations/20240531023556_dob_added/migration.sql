-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL DEFAULT NOW();
