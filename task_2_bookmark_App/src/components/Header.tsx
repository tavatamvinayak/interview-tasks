// components/Header.tsx
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { LogoutButton } from "./logout"

interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          BookMark App  
        </Link>

        <nav>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}