'use client'

import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'

export default function ButtonLogin() {
  return (
    <button
      className="flex items-center bg-white text-gray-800 font-semibold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
      onClick={() => signIn("github", { callbackUrl: "/home" })}
    >
      <FaGithub className="mr-3 text-2xl" />
      Entrar com GitHub
    </button>
  )
}
