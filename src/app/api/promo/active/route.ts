import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const promoCode = await prisma.promoCode.findFirst({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null }, 
          { expiresAt: { gt: new Date() } }, 
        ],
      },
      orderBy: {
        createdAt: "desc", 
      },
    })

    if (!promoCode) {
      return NextResponse.json({
        title: "",
        description: "",
        promoCode: null,
      })
    }

    let title = "Специальное предложение"
    let description = "Успейте получить скидку на все товары в корзине"

    
    return NextResponse.json({
      title,
      description,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        discount: promoCode.discount,
        isActive: promoCode.isActive,
        expiresAt: promoCode.expiresAt,
        createdAt: promoCode.createdAt,
      },
    })
  } catch (error) {
    console.error("Error fetching active promo:", error)
    return NextResponse.json({ error: "Failed to fetch promo data" }, { status: 500 })
  }
}
