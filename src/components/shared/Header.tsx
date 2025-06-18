import Link from "next/link"
import { auth, signOut } from "../../../auth"
import { Button } from "@/components/ui/button"
import UserAvatar from "./UserAvatar"
import SearchInput from "./SearchInput"
import MobileMenu from "./MobileMenu"

async function Header() {
  const session = await auth()
  const isAdmin = session?.user?.role === "admin"
  if (!session) return null

  const handleSignOut = async () => {
    "use server"
    await signOut()
  }

  return (
    <header className="w-full bg-[#0a0a0a] sticky py-4 top-0 mb-6 z-50">
      <nav className="flex justify-between items-center px-4">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold max-sm:text-lg">E-com</h1>
        </Link>
          <SearchInput />
        <div className="hidden 2xl:flex items-center gap-2">
          <Button asChild>
            <Link href={"/cart"}>
              <span>Корзина</span>
            </Link>
          </Button>

          {session?.user ? (
            <div className="flex items-center space-x-2">
              <form action={handleSignOut}>
                <Button type="submit" className="cursor-pointer">
                  Выйти
                </Button>
              </form>
              <Button className="cursor-pointer" asChild>
                <Link href={"/orders"}>Заказы</Link>
              </Button>
              {isAdmin && (
                <Button className="cursor-pointer" asChild>
                  <Link href={"/admin"}>Админ-панель</Link>
                </Button>
              )}
            </div>
          ) : (
            <Button asChild className="cursor-pointer">
              <Link href={"/sign-in"}>Войти</Link>
            </Button>
          )}
          <Link href={"/profile"}>
          <UserAvatar />
          </Link>
        </div>

        <div className="flex 2xl:hidden items-center gap-2">
          <MobileMenu session={session} isAdmin={isAdmin} onSignOut={handleSignOut} />
        </div>
      </nav>
    </header>
  )
}

export default Header
