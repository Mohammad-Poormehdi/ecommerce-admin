import { AvatarProps } from "@radix-ui/react-avatar"
import { UserIcon } from "lucide-react"
import { User } from "next-auth"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <>
      <Avatar {...props}>
        {user.image ? (
          <AvatarImage src={user.image} />
        ) : (
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        )}
      </Avatar>
    </>
  )
}

export default UserAvatar
