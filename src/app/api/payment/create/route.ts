import { type NextRequest, NextResponse } from "next/server"
import { YooCheckout } from "@a2seven/yoo-checkout"
import { auth } from "../../../../../auth"
import { getCartItems } from "@/actions/cart.actions"
import { prisma } from "@/lib/prisma"

const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!prisma) {
      console.error("Prisma client is not initialized")
      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }

    const { promoCode } = await request.json()
    const { items: cartItems, totalPrice } = await getCartItems()

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    let finalPrice = totalPrice
    let appliedPromo = null

    // Проверяем и применяем промокод если он предоставлен
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
      })

      if (promo && promo.isActive && (!promo.expiresAt || promo.expiresAt > new Date())) {
        const discountAmount = (totalPrice * promo.discount) / 100
        finalPrice = totalPrice - discountAmount
        appliedPromo = promo
        console.log(`Applied promo code: ${promo.code}, discount: ${promo.discount}%, final price: ${finalPrice}`)
      } else {
        return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 400 })
      }
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://ecom-y3vl.vercel.app" 
        : `${process.env.NEXT_PUBLIC_BASE_URL}`

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: finalPrice,
        status: "pending",
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    })

    console.log("Order created:", order.id)

    const paymentData = {
      amount: {
        value: finalPrice.toFixed(2),
        currency: "RUB",
      },
      confirmation: {
        type: "redirect" as const,
        return_url: `${baseUrl}/payment/success?orderId=${order.id}`,
      },
      capture: true,
      description: `Заказ #${order.id}${appliedPromo ? ` (промокод: ${appliedPromo.code})` : ""}`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        promoCode: appliedPromo?.code || null,
        originalPrice: totalPrice.toString(),
        finalPrice: finalPrice.toString(),
      },
    }

    console.log("Creating payment with data:", paymentData)

    const payment = await checkout.createPayment(paymentData)

    console.log("Payment created:", payment.id)

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation?.confirmation_url,
      orderId: order.id,
      finalPrice: finalPrice,
      appliedPromo: appliedPromo
        ? {
            code: appliedPromo.code,
            discount: appliedPromo.discount,
          }
        : null,
    })
  } catch (error) {
    console.error("Payment creation error:", error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to create payment",
          details: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
