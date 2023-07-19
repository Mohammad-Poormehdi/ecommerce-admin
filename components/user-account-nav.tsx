'use client'

import { ExitIcon } from "@radix-ui/react-icons"
import { User } from "next-auth"
import { signOut } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import UserAvatar from "./ui/user-avatar"

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">
}

const UserAccountNav: React.FC<UserAccountNavProps> = ({ user }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            user={{
              name: user.name || null,
              image: user.image || null,
            }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-3">
          <div className="flex items-center justify-start p-4 gap-x-4">
            <UserAvatar
              user={{
                name: user.name,
                image: user.image,
              }}
            />
            <div className="flex flex-col ">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <p className="text-xs text-neutral-500">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              signOut()
            }}
          >
            <div className="flex items-center justify-start gap-x-3 cursor-pointer">
              <ExitIcon />
              <p>Sign out</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserAccountNav
