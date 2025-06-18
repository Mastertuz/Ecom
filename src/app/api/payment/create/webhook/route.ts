import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log("Raw webhook body:", body)

    const notification = JSON.parse(body)
    console.log("Parsed webhook notification:", JSON.stringify(notification, null, 2))

    if (!notification.object || !notification.event) {
      console.error("Invalid notification format")
      return NextResponse.json({ error: "Invalid notification format" }, { status: 400 })
    }

    const { object: payment, event } = notification

    console.log("Processing event:", event)
    console.log("Payment status:", payment.status)
    console.log("Payment metadata:", payment.metadata)

    if (event === "payment.succeeded" && payment.status === "succeeded") {
      const orderId = payment.metadata?.orderId

      if (orderId) {
        console.log("Processing successful payment for order:", orderId)

        try {
          const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: "paid" },
          })

          console.log("Order updated successfully:", updatedOrder)

          const order = await prisma.order.findUnique({
            where: { id: orderId },
            select: { userId: true },
          })

          if (order) {
            const deletedItems = await prisma.cartItem.deleteMany({
              where: { userId: order.userId },
            })
            console.log("Cart cleared for user:", order.userId, "Deleted items:", deletedItems.count)
          }

          console.log(`Order ${orderId} marked as paid and cart cleared`)
        } catch (dbError) {
          console.error("Database error in webhook:", dbError)
          return NextResponse.json({ error: "Database error" }, { status: 500 })
        }
      } else {
        console.error("No orderId in payment metadata")
      }
    } else if (event === "payment.canceled" && payment.status === "canceled") {
      const orderId = payment.metadata?.orderId

      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "canceled" },
          })

          console.log(`Order ${orderId} marked as canceled`)
        } catch (dbError) {
          console.error("Database error updating canceled order:", dbError)
        }
      }
    } else {
      console.log("Unhandled event or status:", event, payment.status)
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
