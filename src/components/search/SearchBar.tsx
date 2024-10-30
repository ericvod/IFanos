'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import { User } from '@/types'

export default function SearchBar() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<User[]>([])
    const [showResults, setShowResults] = useState(false)
    const { data: session } = useSession()

    useEffect(() => {
        const searchUsers = async () => {
            if (!query.trim()) {
                setResults([])
                return
            }

            try {
                const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
                if (response.ok) {
                    const { data } = await response.json()
                    setResults(data)
                }
            } catch (error) {
                console.error('Erro na busca:', error)
            }
        }

        const timeoutId = setTimeout(searchUsers, 300)
        return () => clearTimeout(timeoutId)
    }, [query])

    const handleFollow = async (userId: string) => {
        try {
            const response = await fetch(`/api/users/${userId}/follow`, {
                method: 'POST'
            })
            if (response.ok) {
                const { data } = await response.json()
                setResults(prev => prev.map(user =>
                    user._id === userId ? data : user
                ))
            }
        } catch (error) {
            console.error('Erro ao seguir/deixar de seguir:', error)
        }
    }

    return (
        <div className="relative w-64">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    placeholder="Buscar usuários..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-96 overflow-y-auto">
                    {results.map(user => (
                        <div
                            key={user._id}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-3">
                                <Image
                                    src={user.image || ''}
                                    alt={user.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {user.followers?.length || 0} seguidores
                                    </p>
                                </div>
                            </div>
                            {user.email !== session?.user?.email && (
                                <button
                                    onClick={() => handleFollow(user._id)}
                                    className={`px-3 py-1 rounded-full text-sm ${user.followers?.some(f => f.toString() === session?.user?.id)
                                            ? 'bg-gray-200 dark:bg-gray-600'
                                            : 'bg-blue-500 text-white'
                                        }`}
                                >
                                    {user.followers?.some(f => f.toString() === session?.user?.id)
                                        ? 'Seguindo'
                                        : 'Seguir'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}