import Image from "next/image"
import { auth } from "../../../auth"
 
export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return null
  const isAdmin = session.user.role === 'admin'

  return (
    <div className="cursor-pointer hover:opacity-80 transition-opacity">
      <Image 
        src={`${isAdmin?'/user-gear.png':'/user.png'}`} 
        width={24} 
        height={24}
        className="size-10 rounded-full object-cover" 
        alt="User Avatar" 
      />
    </div>
  )
}