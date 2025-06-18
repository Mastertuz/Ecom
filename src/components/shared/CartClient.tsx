"use client"

import type { CartItem } from "../../../typings"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import AddToCartButton from "@/components/shared/AddToCartButton"
import Link from "next/link"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface CartClientProps {
  cartItems: CartItem[]
  totalItems: number
  totalPrice: number
}

function CartClient({ cartItems, totalItems, totalPrice }: CartClientProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.confirmationUrl) {
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            paymentId: data.paymentId,
            orderId: data.orderId,
            timestamp: Date.now(),
          }),
        )

        window.location.href = data.confirmationUrl
      } else {
        throw new Error(data.error || "Ошибка создания платежа")
      }
    } catch (error) {
      console.error("Payment error:", error)

      let errorMessage = "Произошла ошибка при создании платежа. Попробуйте еще раз."

      if (error instanceof Error) {
        errorMessage = error.message
      }

      alert(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-[1536px]">
        <h1 className="text-2xl text-white font-bold mb-4">Ваша корзина</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Ваша корзина пуста</p>
            <Button asChild className="mt-4">
              <Link href="/">Продолжить покупки</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4  ">
      <h1 className="text-2xl text-white font-bold mb-4">Ваша корзина</h1>
      <div className="flex flex-col lg:flex-row gap-8 max-[480px]:gap-4">
        <div className="flex-grow space-y-4 ">
          {cartItems.map((cartItem) => (
            <Card key={cartItem.id}>
              <CardContent className="p-4 max-[480px]:p-2">
                <div className="flex items-center justify-between max-[480px]:flex-col ">
                  <div className="flex items-center cursor-pointer flex-1 min-w-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                      {cartItem.product.imageUrl && (
                        <Image
                          src={cartItem.product.imageUrl || "/placeholder.svg"}
                          alt={cartItem.product.name ?? "Product image"}
                          className="w-full h-full object-cover rounded"
                          width={96}
                          height={96}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm xs:text-lg text-white sm:text-xl font-semibold truncate">
                        {cartItem.product.name}
                      </h2>
                      <p className="text-sm sm:text-base text-white">Цена: {cartItem.product.price}₽</p>
                      <p className="text-sm sm:text-base text-white">
                        Итого: {cartItem.product.price * cartItem.quantity}₽
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center ml-4 flex-shrink-0 max-[480px]:mt-4 max-[480px]:ml-0">
                    <AddToCartButton product={cartItem.product} cartItem={cartItem} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="w-full lg:w-80 lg:sticky lg:top-4 h-fit">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold">Информация о заказе</h3>
            <div className="mt-4 space-y-2">
              <p className="flex justify-between">
                <span>Товары:</span>
                <span>{totalItems}</span>
              </p>
              <p className="flex justify-between text-2xl font-bold border-t pt-2">
                <span>Сумма:</span>
                <span>{totalPrice}₽</span>
              </p>
            </div>

            <Button className="mt-4 w-full" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обработка...
                </>
              ) : (
                "Оплатить"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CartClient