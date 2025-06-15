import { HeartIcon, ShoppingBasket, ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";
import { auth, signIn, signOut } from "../../../auth";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import SearchInput from "./SearchInput";

async function Header() {
  const session = await auth();
  const isAdmin = session?.user?.role ==='admin'
  return (
    <header className="w-full bg-[#0a0a0a] sticky py-4 top-0 mb-6 z-50 ">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold">E-com</h1>
        </Link>
       <SearchInput/>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link
              href={"/cart"}
            >
              <span>Корзина</span>
            </Link>
          </Button>

          {session?.user ? (
            <div className="flex items-center space-x-2 ">
            <Button
              onClick={async () => {
                "use server";
                await signOut();
              }}
              className="cursor-pointer"
            >
              Выйти
            </Button>
            <Button className="cursor-pointer" asChild>
              <Link href={"/orders"}>
              Заказы
              </Link>
            </Button>
            {isAdmin && (
            <Button className="cursor-pointer" asChild>
              <Link href={'/admin'}>
              Админ-панель
              </Link>
            </Button>
            )}
            </div>
          ) : (
            <Button
              onClick={async () => {
                "use server";
                await signIn("credentials");
              }}
              className="cursor-pointer"
            >
              Войти
            </Button>
          )}


          <UserAvatar />
        </div>
      </nav>
    </header>
  );
}

export default Header;
