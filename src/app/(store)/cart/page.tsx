import { redirect } from "next/navigation";
import { getCartItems } from "@/actions/cart.actions";
import CartClient from "@/components/shared/CartClient";
import { auth } from "../../../../auth";

async function CartPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
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
