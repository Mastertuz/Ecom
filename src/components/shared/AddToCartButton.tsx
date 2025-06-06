"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Product, CartItem } from "../../../typings"
import { addToCart, updateCartItemQuantity } from "@/actions/cart.actions"
import { useTransition } from "react"

type Props = {
  product: Product
  cartItem?: CartItem
}

export default function AddToCartButton({ product, cartItem }: Props) {
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

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        onClick={handleRemove}
        disabled={quantity === 0 || isPending}
      >
        -
      </Button>
      <span className="text-white font-semibold w-6 text-center">{quantity}</span>
      <Button
        variant="outline"
        onClick={handleAdd}
        disabled={isAtMaxStock || isOutOfStock || isPending}
      >
        +
      </Button>
    </div>
  )
}
