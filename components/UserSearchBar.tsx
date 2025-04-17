"use client"

import { useState, useEffect } from "react"
import { Input } from "./ui/input"
import type { User } from "@/interfaces/users"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

const UserSearchBar = ({ placeholder,navbar }: { placeholder: string,navbar:boolean }) => {
  const pathname = usePathname();
  const [userQuery, setUserQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      if (userQuery.trim()) {
        try {
          const response = await fetch(`/api/user/get-users?query=${encodeURIComponent(userQuery)}`)
          const data = await response.json()
          setUsers(data || [])
          setIsOpen(true)
        } catch (error) {
          console.error("Failed to fetch users:", error)
          setUsers([])
        }
      } else {
        setUsers([])
        setIsOpen(false)
      }
    }
    fetchUsers()
  }, [userQuery])


  if (!["/Discover-recipes/Feed"].includes(pathname) && navbar==true) {
    return <div className="hidden"></div>;
  }

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      <Input
        className="w-full z-10"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        placeholder={placeholder}
        onFocus={() => userQuery.trim() && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 500)}
      />

      {isOpen && users.length > 0 && (
        <div className="absolute w-full mt-1 rounded-md border border-gray-200 bg-white shadow-lg z-20">
          <ul className="py-2 max-h-60 overflow-y-auto">
            {users.map((user) => (
              <li key={user.id} className="px-3 py-2">
                <Link
                  href={`/Account/${user.id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {user.nume.charAt(0).toUpperCase()}
                      {user.prenume.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.nume} {user.prenume}
                    </p>
                    {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

  )
}

export default UserSearchBar
