'use client'

import { signOut } from 'next-auth/react'
import { FaSignOutAlt } from 'react-icons/fa'

export default function ButtonLogout() {
    return (
        <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            onClick={() => signOut()}
        >
            <FaSignOutAlt className="mr-2 -ml-1" />
            Sair
        </button>
    )
}