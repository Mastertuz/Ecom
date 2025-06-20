import type { Product as PrismaProduct, Category as PrismaCategory, Status } from "@prisma/client"

export type Category = PrismaCategory
export type ProductStatus = Status

export interface Product extends PrismaProduct {}

export type ProductCreateInput = {
  name: string
  description?: string
  price: number
  stock: number
  imageUrl: string
  category?: Category
  status?: ProductStatus
}

export interface CartItem {
  id: string
  quantity: number
  userId: string
  productId: string
  createdAt: Date
  updatedAt: Date
  product: Product
}

export interface PromoCode {
  id: string
  code: string
  discount: number
  isActive: boolean
  expiresAt: Date | null
  createdAt: Date
  description?: string
  title?: string
}

export interface SaleBannerData {
  title: string
  description: string
  promoCode: PromoCode | null
}
export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
