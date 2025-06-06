"use client";

import Image from "next/image";
import { Product } from "../../../typings";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  product: Product;
};

function ProductCard({ product }: Props) {
  const isOutOfStock = product.stock != null && product.stock <= 0;

  async function addToCart() {
  if (isOutOfStock) return;

  try {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId: product.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Логируем сырый ответ для диагностики
    const text = await res.text();

    try {
      const data = JSON.parse(text);
      if (data.success) {
        alert(`Товар "${product.name}" добавлен в корзину`);
      } else {
        alert(data.message || "Ошибка при добавлении товара в корзину");
      }
    } catch (jsonErr) {
      console.error("Ошибка парсинга JSON:", jsonErr);
      console.error("Ответ сервера:", text);
      alert("Ошибка ответа от сервера");
    }
  } catch (error) {
    console.error(error);
    alert("Ошибка при добавлении товара в корзину");
  }
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

      <Button
        onClick={addToCart}
        disabled={isOutOfStock}
        className={`cursor-pointer ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Добавить
      </Button>
    </div>
  );
}

export default ProductCard;
