"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { Product, CartItem } from "../../../typings"
import { addToCart, updateCartItemQuantity } from "@/actions/cart.actions"
import { useTransition } from "react"
import { Minus, Plus } from "lucide-react"

type Props = {
  product: Product
  cartItem?: CartItem
  size?: "sm" | "default" | "lg"
  showQuantityLabel?: boolean
}

export default function AddToCartButton({ product, cartItem, size = "default", showQuantityLabel = false }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleAdd = () => {
    startTransition(async () => {
      try {
        const res = await addToCart(product.id)
        if (res.success) {
          toast.success(res.message)
        } else {
          toast.error(res.message)
        }
      } catch (error: any) {
        toast.error(error.message || "Ошибка при добавлении товара")
      }
    })
  }

  const handleRemove = () => {
    if (!cartItem) return
    startTransition(async () => {
      try {
        const res = await updateCartItemQuantity(cartItem.id, cartItem.quantity - 1)
        if (res.success) {
          toast.success(res.message)
        } else {
          toast.error(res.message)
        }
      } catch (error: any) {
        toast.error(error.message || "Ошибка при удалении товара")
      }
    })
  }

  const quantity = cartItem?.quantity || 0
  const isAtMaxStock = quantity >= product.stock
  const isOutOfStock = product.stock <= 0

  // If no item in cart, show add button
  if (quantity === 0) {
    return (
      <Button onClick={handleAdd} disabled={isOutOfStock || isPending} size={size} className="w-full cursor-pointer">
        {isPending ? "Добавление..." : isOutOfStock ? "Нет в наличии" : "Добавить в корзину"}
      </Button>
    )
  }

  // If item in cart, show quantity controls
  const buttonSize = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-6 w-6" : "h-8 w-8"
  const iconSize = size === "lg" ? "h-5 w-5" : size === "sm" ? "h-3 w-3" : "h-4 w-4"
  const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base"

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handleRemove} disabled={isPending} className={buttonSize}>
        <Minus className={iconSize} />
      </Button>

      <div className="flex flex-col items-center">
        <span className={`text-white font-semibold ${textSize} min-w-[2rem] text-center`}>{quantity}</span>
        {showQuantityLabel && <span className="text-gray-400 text-xs">в корзине</span>}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleAdd}
        disabled={isAtMaxStock || isOutOfStock || isPending}
        className={buttonSize}
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  )
}
