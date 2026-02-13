'use client'

import { logout } from '@/app/actions/auth'   // adjust path
import { useRouter } from 'next/navigation'

export function LogoutButton() {
    const router = useRouter()

    return (
        <form action={logout}>
            <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Logout
            </button>
        </form>
    )
}