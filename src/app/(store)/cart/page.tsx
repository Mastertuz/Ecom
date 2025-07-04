import { getCartItems } from "@/actions/cart.actions";
import CartClient from "@/components/shared/CartClient";
import { auth } from "../../../../auth";

async function CartPage() {
  const session = await auth();
  if (!session){
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-center mt-10">
          Пожалуйста, войдите в аккаунт, чтобы просмотреть корзину
        </h1>
      </div>
    )
  }

  const { items: cartItems, totalItems, totalPrice } = await getCartItems();

  return (
      <CartClient
        cartItems={cartItems}
        totalItems={totalItems}
        totalPrice={totalPrice}
      />
  );
}

export default CartPage;
