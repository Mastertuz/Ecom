import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, message: "Промокод обязателен" }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!promoCode) {
      return NextResponse.json({ success: false, message: "Промокод не найден" }, { status: 404 })
    }

    if (!promoCode.isActive) {
      return NextResponse.json({ success: false, message: "Промокод неактивен" }, { status: 400 })
    }

    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return NextResponse.json({ success: false, message: "Срок действия промокода истек" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        discount: promoCode.discount,
        isActive: promoCode.isActive,
      },
    })
  } catch (error) {
    console.error("Promo validation error:", error)
    return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 })
  }
}
