import { getProductById } from "@/actions/products.action";
import { getCartItems } from "@/actions/cart.actions";
import AddToCartButton from "@/components/shared/AddToCartButton";
import Image from "next/image";
import { notFound } from "next/navigation";
import SimilarProducts from "@/components/shared/SimilarProducts";
import { CartItem } from "../../../../../typings";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) return notFound();

  const cartData = await getCartItems();
  const cartItem = cartData.items.find(
    (item: CartItem) => item.productId === product.id
  );
  const isOutOfStock = product?.stock != null && product?.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-xl:flex max-xl:flex-col">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer ${
            isOutOfStock ? "opacity-50" : ""
          }`}
        >
          {product.imageUrl && (
            <Image
              src={product?.imageUrl || ""}
              alt={product.name ?? "Product image"}
              fill
              className="object-contain max-w-2xl transition-transform duration-300 hover:scale-105"
            />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-white font-bold text-lg">
                Товара нет в наличии
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl text-white font-bold mb-4">
              {product.name}
            </h1>
            <div className="text-xl text-white font-semibold mb-4">
              Цена: {product.price}₽
            </div>
            <div className="prose text-white max-w-none mb-6">
              {product.description}
            </div>
            <div className="text-white text-xl mb-2">
              Товара в наличии:{" "}
              <span className="font-bold">{product.stock}</span>
            </div>
          </div>

          <SimilarProducts productName={product.name} />

          <div className="mt-4">
            <AddToCartButton product={product} cartItem={cartItem} />
          </div>
        </div>
      </div>
    </div>
  );
}
