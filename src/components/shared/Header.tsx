import { HeartIcon, ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";
import { auth, signIn, signOut } from "../../../auth";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import SearchInput from "./SearchInput";

async function Header() {
  const session = await auth();
  return (
    <header className="w-full bg-[#0a0a0a] sticky py-4 top-0 mb-6 z-50 ">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold">E-com</h1>
        </Link>
       <SearchInput/>
        <div className="flex gap-2">
          <Button asChild>
            <Link
              href={"/cart"}
            >
              <span>Корзина</span>
            </Link>
          </Button>

          {session?.user ? (
            <Button
              onClick={async () => {
                "use server";
                await signOut();
              }}
              className="cursor-pointer"
            >
              Выйти
            </Button>
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
