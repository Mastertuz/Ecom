import { type NextRequest, NextResponse } from "next/server"
import { YooCheckout } from "@a2seven/yoo-checkout"
import { prisma } from "@/lib/prisma"
import { auth } from "../../../../../../auth"

const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("paymentId")
    const orderId = searchParams.get("orderId")

    if (!paymentId || !orderId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    console.log("Checking payment status:", paymentId)

    const payment = await checkout.getPayment(paymentId)

    console.log("Payment status from YooKassa:", payment.status)

    if (payment.status === "succeeded") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "paid" },
      })

      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      })

      console.log("Order marked as paid and cart cleared")
    } else if (payment.status === "canceled") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "canceled" },
      })

      console.log("Order marked as canceled")
    }

    return NextResponse.json({
      paymentStatus: payment.status,
      orderId,
    })
  } catch (error) {
    console.error("Payment status check error:", error)
    return NextResponse.json({ error: "Failed to check payment status" }, { status: 500 })
  }
}
