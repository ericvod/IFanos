'use client'

import { useSession } from 'next-auth/react'
import { usePosts } from '@/hooks/usePosts'
import Header from '@/components/layout/Header'
import PostCard from '../posts/PostCard'


export default function HomePageClient() {
    const { data: session, status } = useSession()
    const {
        posts,
        editingPost,
        setEditingPost,
        content,
        setContent,
        handleSubmit,
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
                {session && (
                    <form onSubmit={editingPost ? handleUpdate : handleSubmit} className="mb-6">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={editingPost ? "Edite sua postagem" : "O que você está pensando?"}
                            className="w-full p-2 border rounded"
                        />
                        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                            {editingPost ? "Atualizar" : "Publicar"}
                        </button>
                        {editingPost && (
                            <button
                                type="button"
                                onClick={() => { setEditingPost(null); setContent(''); }}
                                className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
                            >
                                Cancelar
                            </button>
                        )}
                    </form>
                )}
                <div>
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onLike={handleLike}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}