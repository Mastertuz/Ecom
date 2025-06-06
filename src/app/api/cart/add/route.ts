// app/api/cart/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addToCart } from "@/actions/cart.actions";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, message: "productId обязателен" }, { status: 400 });
    }

    const result = await addToCart(productId);

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Ошибка в API добавления товара в корзину:", error);
    return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
  }
}
