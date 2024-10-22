'use client'

import { signOut } from 'next-auth/react'

export default function ButtonLogout() {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={() => signOut()}
        >
            Logout
        </button>
    )
}