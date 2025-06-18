import { NextResponse } from "next/server"
import { YooCheckout } from "@a2seven/yoo-checkout"
import { auth } from "../../../../../auth"
import { getCartItems } from "@/actions/cart.actions"
import { prisma } from "@/lib/prisma"

const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
})

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!prisma) {
      console.error("Prisma client is not initialized")
      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }

    const { items: cartItems, totalPrice } = await getCartItems()

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    console.log("Creating order for user:", session.user.id)
    console.log("Cart items:", cartItems.length)
    console.log("Total price:", totalPrice)

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: totalPrice,
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
        value: totalPrice.toFixed(2),
        currency: "RUB",
      },
      confirmation: {
        type: "redirect" as const,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${order.id}`,
      },
      capture: true,
      description: `Заказ #${order.id}`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    }

    console.log("Creating payment with data:", paymentData)

    const payment = await checkout.createPayment(paymentData)

    console.log("Payment created:", payment.id)

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation?.confirmation_url,
      orderId: order.id,
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