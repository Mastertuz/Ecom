
import { getAllProducts } from "@/actions/products.action";
import AddToCartButton from "@/components/shared/AddToCartButton";
import { Button } from "@/components/ui/button";
import Image from "next/image";

async function CartPage() {
  const products= await getAllProducts()
 const isSignedIn = true
 const isLoading = false
  return (
    <div className="container mx-auto p-4 max-w-[1536px]  ">
      <h1 className="text-2xl text-white font-bold mb-4">Ваша корзина</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {products?.map((product) => (
            <div
              key={product.id}
              className="mb-4 p-4 border border-gray-300 rounded flex items-center justify-between"
            >
              <div
                className="flex items-center cursor-pointer flex-1 min-w-0"
               
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.name ?? "Product image"}
                      className="w-full h-full object-cover rounded"
                      width={96}
                      height={96}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm xs:text-lg text-white sm:text-xl font-semibold truncate">
                    {product.name}
                  </h2>
                  <p className="text-sm sm:text-base text-white">
                    Итого: {((product.price ?? 0)*product.stock)}₽
                  </p>
                </div>
              </div>
              <div className="flex items-center ml-4 flex-shrink-0">
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit  p-6 border border-gray-300 rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
          <h3 className="text-xl font-semibold">Информация о заказе</h3>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Товары:</span>
              <span>
                {products.reduce((total, item) => total + item.stock, 0)}
              </span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Сумма:</span>
              <span>
                {/* £{useBasketStore.getState().getTotalPrice().toFixed(2)} */}
              </span>
            </p>
          </div>

          {isSignedIn ? (
            <Button
              // onClick={handleCheckout}
              // disabled={isLoading}
              className="mt-4 cursor-pointer w-full"
            >
              {isLoading ? "Загрузка..." : "Оплатить"}
            </Button>
          ) : (
              <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Sign in to Checkout
              </button>
          )}
        </div>

        <div className="h-64 lg:h-0"></div>
      </div>
    </div>
  );
}

export default CartPage;