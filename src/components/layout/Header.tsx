'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import ButtonLogout from '../auth/ButtonLogout'
import { FaBars, FaMoon, FaSun, FaTimes } from 'react-icons/fa'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const { data: session } = useSession()

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link href="/home" className="flex items-center space-x-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                                IFanos
                            </span>
                        </Link>
                    </div>
                    <div className="-mr-2 -my-2 md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                    <nav className="hidden md:flex space-x-10">
                        <Link
                            href="/home"
                            className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            Home
                        </Link>
                        <Link
                            href="/profile"
                            className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            Perfil
                        </Link>
                        <Link
                            href="/communities"
                            className="text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            Comunidades
                        </Link>
                    </nav>
                    <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
                        {session?.user?.image && (
                            <Image
                                src={session.user.image}
                                alt="Profile"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        )}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
                        </button>
                        <ButtonLogout />
                    </div>
                </div>
                <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/home"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/profile"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Perfil
                        </Link>
                        <Link
                            href="/communities"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Comunidades
                        </Link>
                        <div className="px-3 py-2 space-y-2">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                            >
                                {theme === 'dark' ? (
                                    <>
                                        <FaSun className="mr-3" /> Tema Claro
                                    </>
                                ) : (
                                    <>
                                        <FaMoon className="mr-3" /> Tema Escuro
                                    </>
                                )}
                            </button>
                            <div className="w-full">
                                <ButtonLogout />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}