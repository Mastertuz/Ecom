"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "../../auth"
import type { Cart } from "../../typings" 

interface CartActionResult {
  success: boolean
  message: string
  cartItemId?: string
  quantity?: number
}

export async function addToCart(productId: string): Promise<CartActionResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Необходимо авторизоваться")
    const userId = session.user.id

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new Error("Товар не найден")
    if (product.stock <= 0) throw new Error("Товар закончился")

    const existingCartItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    })

    let cartItem
    if (existingCartItem) {
      if (existingCartItem.quantity >= product.stock) {
        throw new Error("Больше товара нет на складе")
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      })
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
      })
    }

    revalidatePath("/cart")
    return {
      success: true,
      message: "Товар добавлен в корзину",
      cartItemId: cartItem.id,
      quantity: cartItem.quantity,
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Ошибка при добавлении товара в корзину",
    }
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartActionResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Необходимо авторизоваться")
    const userId = session.user.id

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
      include: { product: true },
    })

    if (!cartItem) throw new Error("Товар не найден в корзине")

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } })
      revalidatePath("/cart")
      return { success: true, message: "Товар удален из корзины" }
    }

    if (quantity > cartItem.product.stock) {
      throw new Error(`Максимум ${cartItem.product.stock} шт. в наличии`)
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    })

    revalidatePath("/cart")
    return {
      success: true,
      message: "Количество обновлено",
      cartItemId: updatedCartItem.id,
      quantity: updatedCartItem.quantity,
    }
  } catch (error) {
    console.error("Error updating cart item:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Ошибка при обновлении корзины",
    }
  }
}

export async function getCartItems(): Promise<Cart> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { items: [], totalItems: 0, totalPrice: 0 }
    const userId = session.user.id

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    })

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    return { items: cartItems, totalItems, totalPrice }
  } catch (error) {
    console.error("Error fetching cart:", error)
    return { items: [], totalItems: 0, totalPrice: 0 }
  }
}

export async function removeFromCart(cartItemId: string): Promise<CartActionResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Необходимо авторизоваться")
    const userId = session.user.id

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
    })

    if (!cartItem) throw new Error("Товар не найден в корзине")

    await prisma.cartItem.delete({ where: { id: cartItemId } })

    revalidatePath("/cart")
    return { success: true, message: "Товар удален из корзины" }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Ошибка при удалении товара из корзины",
    }
  }
}
