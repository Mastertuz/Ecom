import AddToCartButton from "@/components/shared/AddToCartButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "../../../auth"
import { redirect } from "next/navigation"
import Image from "next/image"

async function CartPage() {
  const session = await auth()

  if (!session) {
    redirect("/sign-in")
  }



  // if (cartItems.length === 0) {
  //   return (
  //     <div className="container mx-auto p-4 max-w-[1536px]">
  //       <h1 className="text-2xl text-white font-bold mb-4">Ваша корзина</h1>
  //       <Card>
  //         <CardContent className="p-8 text-center">
  //           <p className="text-muted-foreground">Ваша корзина пуста</p>
  //           <Button asChild className="mt-4">
  //             <a href="/">Продолжить покупки</a>
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="container mx-auto p-4 max-w-[1536px]">
      {/* <h1 className="text-2xl text-white font-bold mb-4">Ваша корзина</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-4">
          {cartItems.map((cartItem) => (
            <Card key={cartItem.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center cursor-pointer flex-1 min-w-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                      {cartItem.product.imageUrl && (
                        <Image
                          src={cartItem.product.imageUrl || "/placeholder.svg"}
                          alt={cartItem.product.name ?? "Product image"}
                          className="w-full h-full object-cover rounded"
                          width={96}
                          height={96}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm xs:text-lg text-white sm:text-xl font-semibold truncate">
                        {cartItem.product.name}
                      </h2>
                      <p className="text-sm sm:text-base text-white">Цена: {cartItem.product.price}₽</p>
                      <p className="text-sm sm:text-base text-white">
                        Итого: {cartItem.product.price * cartItem.quantity}₽
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center ml-4 flex-shrink-0">
                    <AddToCartButton product={cartItem.product} cartItem={cartItem} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="w-full lg:w-80 lg:sticky lg:top-4 h-fit">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold">Информация о заказе</h3>
            <div className="mt-4 space-y-2">
              <p className="flex justify-between">
                <span>Товары:</span>
                <span>{totalItems}</span>
              </p>
              <p className="flex justify-between text-2xl font-bold border-t pt-2">
                <span>Сумма:</span>
                <span>{totalPrice}₽</span>
              </p>
            </div>

            <Button className="mt-4 w-full">Оплатить</Button>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}

export default CartPage
