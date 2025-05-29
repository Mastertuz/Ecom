import { auth } from "../../../auth"
 
export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return null

  return (
    <div className="cursor-pointer hover:opacity-80 transition-opacity">
      <img src={session.user.image ?? undefined} 
      className="size-10 rounded-full" 
      alt="User Avatar" />
    </div>
  )
}