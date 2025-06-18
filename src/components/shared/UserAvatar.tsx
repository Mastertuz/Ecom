import { auth } from "../../../auth";
import { AvatarImage,Avatar } from "../ui/avatar";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;
  return (
    <div className="cursor-pointer hover:opacity-80 transition-opacity">
      <Avatar className="size-10">
        <AvatarImage  src={session.user.image || 'user.png'}/>
      </Avatar>
      
    </div>
  );
}
