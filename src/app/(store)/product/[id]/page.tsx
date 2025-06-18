import { getProductById } from "@/actions/products.action";
import { getCartItems } from "@/actions/cart.actions";
import AddToCartButton from "@/components/shared/AddToCartButton";
import Image from "next/image";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 60;
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getSimilarProductName(
  productName: string
): Promise<{ name: string; link: string }[] | null> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {
        role: "user",
        content: `Suggest a similar product to "${productName}" and return only an array of objects that contains name and link that will lead to google search page of that product (give me 1 to 3 products). Don't send any text in response, just the object.`,
      },
    ],
  });

  try {
    let responseContent = completion.choices[0].message.content ?? "[]";

    if (responseContent.startsWith("```") && responseContent.endsWith("```")) {
      responseContent = responseContent
        .replace(/^```[a-zA-Z]*\n/, "")
        .replace(/```$/, "");
    }

    if (
      !responseContent.trim().startsWith("[") ||
      !responseContent.trim().endsWith("]")
    ) {
      console.error("Invalid AI response format:", responseContent);
      return null;
    }

    const similarProducts = JSON.parse(responseContent);
    if (!Array.isArray(similarProducts)) {
      console.error("AI response is not an array:", responseContent);
      return null;
    }

    return similarProducts;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return null;
  }
}

async function ProductPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return notFound();
  }

  const cartData = await getCartItems();
  const cartItem = cartData.items.find((item) => item.productId === product.id);

  let similar: { name: string; link: string }[] | null = null;

  if (product.name) {
    similar = await getSimilarProductName(product.name);
    console.log(similar);
  }

  const isOutOfStock = product?.stock != null && product?.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer${
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
              Цена : {product.price}₽
            </div>
            <div className="prose text-white max-w-none mb-6">
              {product.description}
            </div>

            <div className="text-white text-xl mb-2">
              Товара в Наличии:{" "}
              <span className="font-bold">{product.stock}</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-white text-2xl mb-6">
              Схожие товары при помощи OpenAI:
            </div>
            {similar && similar.length > 0 ? (
              <div className="space-y-4">
                {similar.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-800"
                  >
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 hover:bg-gray-700 transition-colors rounded p-2"
                    >
                      <div>
                        <h2 className="text-lg text-white font-bold underline hover:text-blue-400 transition-colors">
                          {item.name}
                        </h2>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white text-lg">
                Не удалось найти похожие товары.
              </div>
            )}
          </div>

          <AddToCartButton product={product} cartItem={cartItem} />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
