-- AlterEnum
ALTER TYPE "Category" ADD VALUE 'ВСЕ';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "category" SET DEFAULT 'ВСЕ';
