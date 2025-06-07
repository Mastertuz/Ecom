"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import type { Product } from "../../../typings"
import Link from "next/link"
import { Button } from "../ui/button"
import { Minus, Plus } from "lucide-react"
import { addToCart, updateCartItemQuantity } from "@/actions/cart.actions"
import { toast } from "sonner"

type Props = {
  product: Product
}

interface CartActionResult {
  success: boolean
  message: string
  cartItemId?: string
  quantity?: number
}

function ProductCard({ product }: Props) {
  const isOutOfStock = product.stock != null && product.stock <= 0
  const [isInCart, setIsInCart] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const [cartItemId, setCartItemId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleAddToCart() {
    if (isOutOfStock) return

    startTransition(async () => {
      try {
        const result: CartActionResult = await addToCart(product.id)
        if (result.success && result.cartItemId) {
          setIsInCart(true)
          setQuantity(result.quantity || 1)
          setCartItemId(result.cartItemId)
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error: any) {
        console.error("Error adding to cart:", error)
        toast.error(error.message || "Ошибка при добавлении товара в корзину")
      }
    })
  }

  async function handleUpdateQuantity(newQuantity: number) {
    if (newQuantity < 0 || (product.stock != null && newQuantity > product.stock)) return
    if (!cartItemId) {
      console.error("No cartItemId available")
      return
    }

    startTransition(async () => {
      try {
        const result = await updateCartItemQuantity(cartItemId, newQuantity)
        if (result.success) {
          if (newQuantity === 0) {
            setIsInCart(false)
            setQuantity(0)
            setCartItemId(null)
          } else {
            setQuantity(newQuantity)
          }
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error: any) {
        console.error("Error updating quantity:", error)
        toast.error(error.message || "Ошибка при обновлении количества товара")
      }
    })
  }

  return (
    <div
      className={`
        border border-gray-300 p-4 w-[220px] rounded-[40px] hover:shadow-gray-300 transition-all duration-200 ease-in-out cursor-pointer
        bg-transparent
        group flex flex-col shadow-sm hover:shadow-md overflow-hidden ${isOutOfStock ? "opacity-50" : ""}
      `}
    >
      <Link href={`product/${product.id}`} className="relative aspect-square size-full overflow-hidden">
        {product?.imageUrl && (
          <Image
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            src={product?.imageUrl || ""}
            alt={product.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-white truncate">{product.name}</h2>
        <p className="mt-2 text-sm text-white font-extrabold">{product.price} ₽</p>
      </div>

      {!isInCart ? (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isPending}
          className={`cursor-pointer ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isPending ? "Добавление..." : "Добавить"}
        </Button>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(quantity - 1)}
            disabled={isPending}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-white font-semibold w-6 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(quantity + 1)}
            disabled={isPending || (product.stock != null && quantity >= product.stock)}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductCard
