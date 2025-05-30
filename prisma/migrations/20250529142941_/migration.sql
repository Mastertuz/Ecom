-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Активно',
ALTER COLUMN "description" DROP NOT NULL;
