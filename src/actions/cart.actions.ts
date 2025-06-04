"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "../../auth"

/**
 * Adds a product to the current user's cart
 */
export async function addToCart(productId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Необходимо авторизоваться")
    }

    const userId = session.user.id

    // Check if product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error("Товар не найден")
    }

    if (product.stock <= 0) {
      throw new Error("Товар закончился")
    }

    // Check if item already exists in user's cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (existingCartItem) {
      // Update quantity if item already in user's cart
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      })
    } else {
      // Create new cart item for this user
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
      })
    }

    revalidatePath("/")
    return { success: true, message: "Товар добавлен в корзину" }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Ошибка при добавлении товара в корзину",
    }
  }
}

/**
 * Gets all cart items for the current user
 */
export async function getCartItems() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { items: [], totalItems: 0, totalPrice: 0 }
    }

    const userId = session.user.id

    // Get only this user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    })

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    return {
      items: cartItems,
      totalItems,
      totalPrice,
    }
  } catch (error) {
    console.error("Error fetching cart:", error)
    return { items: [], totalItems: 0, totalPrice: 0 }
  }
}

/**
 * Updates the quantity of an item in the user's cart
 */
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Необходимо авторизоваться")
    }

    const userId = session.user.id

    // First verify this cart item belongs to the current user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId, // Ensure the item belongs to this user
      },
    })

    if (!cartItem) {
      throw new Error("Товар не найден в корзине")
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      })
      revalidatePath("/cart")
      return { success: true, message: "Товар удален из корзины" }
    }

    // Update the quantity
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    })

    revalidatePath("/cart")
    return { success: true, message: "Количество обновлено" }
  } catch (error) {
    console.error("Error updating cart item:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Ошибка при обновлении корзины",
    }
  }
}

/**
 * Removes an item from the user's cart
 */
export async function removeFromCart(cartItemId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Необходимо авторизоваться")
    }

    const userId = session.user.id

    // First verify this cart item belongs to the current user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId, // Ensure the item belongs to this user
      },
    })

    if (!cartItem) {
      throw new Error("Товар не найден в корзине")
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    })

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

/**
 * Clears all items from the user's cart
 */
export async function clearCart() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Необходимо авторизоваться")
    }

    const userId = session.user.id

    // Delete all cart items for this user
    await prisma.cartItem.deleteMany({
      where: { userId },
    })

    revalidatePath("/cart")
    return { success: true, message: "Корзина очищена" }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Ошибка при очистке корзины",
    }
  }
}
