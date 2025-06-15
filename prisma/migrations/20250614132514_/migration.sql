/*
  Warnings:

  - You are about to drop the column `productDescription` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `OrderItem` table. All the data in the column will be lost.
  - Made the column `productId` on table `CartItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Электроника', 'Одежда', 'Дом_и_сад', 'Спорт', 'Книги', 'Красота', 'Игрушки', 'Автомобили', 'Другое');

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "productDescription",
DROP COLUMN "productName",
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'Другое';

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
