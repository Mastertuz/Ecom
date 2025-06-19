"use client"

import type { CartItem } from "../../../typings"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import AddToCartButton from "@/components/shared/AddToCartButton"
import Link from "next/link"
import { useState } from "react"
import { Loader2, Tag, CheckCircle, AlertCircle } from "lucide-react"

interface CartClientProps {
  cartItems: CartItem[]
  totalItems: number
  totalPrice: number
}

interface PromoCode {
  id: string
  code: string
  discount: number
  isActive: boolean
}

function CartClient({ cartItems, totalItems, totalPrice }: CartClientProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [promoError, setPromoError] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const discountAmount = appliedPromo ? (totalPrice * appliedPromo.discount) / 100 : 0
  const finalPrice = totalPrice - discountAmount

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Введите промокод")
      return
    }

    setIsApplyingPromo(true)
    setPromoError("")

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase() }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAppliedPromo(data.promoCode)
        setPromoCode("")
        setPromoError("")
      } else {
        setPromoError(data.message || "Промокод недействителен")
        setAppliedPromo(null)
      }
    } catch (error) {
      console.error("Promo validation error:", error)
      setPromoError("Ошибка при проверке промокода")
      setAppliedPromo(null)
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode("")
    setPromoError("")
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promoCode: appliedPromo?.code || null,
        }),
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Ваша корзина</h1>
      <div className="flex flex-col lg:flex-row gap-8 max-[480px]:gap-4">
        <div className="flex-grow space-y-4">
          {cartItems.map((cartItem) => (
            <Card key={cartItem.id}>
              <CardContent className="p-4 max-[480px]:p-2">
                <div className="flex items-center justify-between max-[480px]:flex-col">
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
            <h3 className="text-xl font-semibold mb-4">Информация о заказе</h3>

            {/* Промокод секция */}
            <div className="mb-6 space-y-3">
              <Label htmlFor="promo" className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Промокод
              </Label>

              {!appliedPromo ? (
                <div className="flex gap-2">
                  <Input
                    id="promo"
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    disabled={isApplyingPromo}
                  />
                  <Button onClick={handleApplyPromo} disabled={isApplyingPromo || !promoCode.trim()} size="sm">
                    {isApplyingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Применить"}
                  </Button>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-800 text-sm">
                        Промокод <strong>{appliedPromo.code}</strong> применен (-{appliedPromo.discount}%)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePromo}
                      className="h-auto p-1 text-green-600 hover:text-green-800"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              )}

              {promoError && (
                <div className="border border-red-200 bg-red-50 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-800 text-sm">{promoError}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Информация о заказе */}
            <div className="space-y-2">
              <p className="flex justify-between">
                <span>Товары:</span>
                <span>{totalItems}</span>
              </p>
              <p className="flex justify-between">
                <span>Сумма товаров:</span>
                <span>{totalPrice}₽</span>
              </p>

              {appliedPromo && (
                <p className="flex justify-between text-green-600">
                  <span>Скидка ({appliedPromo.discount}%):</span>
                  <span>-{discountAmount.toFixed(2)}₽</span>
                </p>
              )}

              <div className="border-t pt-2">
                <p className="flex justify-between text-2xl font-bold">
                  <span>К оплате:</span>
                  <span className={appliedPromo ? "text-green-600" : ""}>{finalPrice.toFixed(2)}₽</span>
                </p>
                {appliedPromo && <p className="text-sm text-muted-foreground line-through text-right">{totalPrice}₽</p>}
              </div>
            </div>

            <Button className="mt-6 w-full" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обработка...
                </>
              ) : (
                `Оплатить ${finalPrice.toFixed(2)}₽`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CartClient
