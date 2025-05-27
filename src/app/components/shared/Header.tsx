import { HeartIcon, ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";
import { auth, signIn, signOut } from "../../../../auth";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";

async function Header() {
    const session = await auth();
  return (
    <header>
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold">E-commerce Shop</h1>
        </Link>

        <ul className="flex justify-between items-center gap-4">
          <li className="flex items-center">
            <Link href={"/likes"} className="flex items-center gap-1">
              <HeartIcon size={24}/>
            </Link>
          </li>
          <li>
            <Link href={"/cart"} className="flex items-center gap-1">
              <ShoppingBasketIcon size={24} />
            </Link>
          </li>
        </ul>
        <div className="flex gap-2">
            {session?.user ? (
                <Button
                onClick={async () => {
                    "use server";
                    await signOut();
                }}
                className="cursor-pointer"
                >
                Sign out
                </Button>
            ) : (
                <Button
                onClick={async () => {
                    "use server";
                    await signIn("google");
                }}
                className="cursor-pointer"
                >
                Sign in
                </Button>
            )}
       
          <UserAvatar />
        </div>
      </nav>
    </header>
  );
}

export default Header;
