'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { usePosts } from '@/hooks/usePosts'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import PostCard from '../posts/PostCard'

export default function ProfileClient() {
    const { data: session, status } = useSession();
    const {
        posts,
        editingPost,
        setEditingPost,
        content,
        setContent,
        handleEdit,
        handleUpdate,
        handleDelete,
        handleLike,
    } = usePosts()

    if (status === 'loading') {
        return <div>Carregando...</div>
    }

    return (
        <div>
            <Header />
            <main className="max-w-3xl mx-auto mt-6">
                <h1 className="text-2xl font-bold mb-4">Perfil</h1>
                {session?.user && (
                    <div className="mb-6">
                        {session.user.image && (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || ''}
                                width={80}
                                height={80}
                                className="rounded-full"
                            />
                        )}
                        <h2 className="text-xl font-semibold">{session.user.name}</h2>
                        <p>{session.user.email}</p>
                    </div>
                )}
                <h2 className="text-xl font-semibold mb-2">Minhas Postagens</h2>
                {editingPost && (
                    <form onSubmit={handleUpdate} className="mb-6">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Edite sua postagem"
                            className="w-full p-2 border rounded"
                        />
                        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                            Atualizar
                        </button>
                        <button
                            type="button"
                            onClick={() => { setEditingPost(null); setContent(''); }}
                            className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Cancelar
                        </button>
                    </form>
                )}
                {posts.filter(post => post.author.email === session?.user?.email).map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onLike={handleLike}
                    />
                ))}
            </main>
        </div>
    )
}