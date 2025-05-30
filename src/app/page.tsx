import { SignIn } from "@/components/shared/sign-in";
import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()
  if(!session) redirect('/sign-in')
  return <main className="">
    {session?.user?.email}
  </main>;
}
