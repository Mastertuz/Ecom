"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  session: any;
  isAdmin: boolean;
  onSignOut: () => Promise<void>;
}

export default function MobileMenu({
  session,
  isAdmin,
  onSignOut,
}: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="cursor-pointer" variant="ghost" size="icon">
          <Menu className="size-8" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] ">
        <SheetHeader>
          <SheetTitle>Меню</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-6 px-4">
          <SheetClose asChild>
            <Button asChild className="w-full justify-start">
              <Link href={"/"}>Главная</Link>
            </Button>
          </SheetClose>
           <SheetClose asChild>
            <Button asChild className="w-full justify-start">
              <Link href={"/profile"}>Профиль</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button asChild className="w-full justify-start">
              <Link href={"/cart"}>Корзина</Link>
            </Button>
          </SheetClose>

          {session?.user ? (
            <>
              <SheetClose asChild>
                <Button className="w-full justify-start" asChild>
                  <Link href={"/orders"}>Заказы</Link>
                </Button>
              </SheetClose>

              {isAdmin && (
                <SheetClose asChild>
                  <Button className="w-full justify-start" asChild>
                    <Link href={"/admin"}>Админ-панель</Link>
                  </Button>
                </SheetClose>
              )}
              <SheetClose asChild>
                  <Button
                    type="submit"
                    className="w-full justify-start"
                    variant="destructive"
                    onClick={async()=>await onSignOut()}
                  >
                    Выйти
                  </Button>
              </SheetClose>
            </>
          ) : (
            <SheetClose asChild>
              <Button asChild className="w-full justify-start">
                <Link href={"/sign-in"}>Войти</Link>
              </Button>
            </SheetClose>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
