import React, { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { FaTrash } from 'react-icons/fa'

interface CommentSectionProps {
    postId: string
    comments: any[]
    onAddComment: (content: string) => Promise<boolean>
    onDeleteComment: (commentId: string) => Promise<boolean>
}

export default function CommentSection({
    postId,
    comments,
    onAddComment,
    onDeleteComment
}: CommentSectionProps) {
    const { data: session } = useSession()
    const [newComment, setNewComment] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const success = await onAddComment(newComment)
        if (success) {
            setNewComment('')
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR')
    };

    return (
        <div className="mt-4">
            {session && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Adicione um comentário..."
                        className="w-full p-2 border rounded resize-none"
                        rows={2}
                    />
                    <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Comentar
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment._id} className="flex space-x-3 p-3 bg-gray-50 rounded">
                        <div>
                            <Image
                                src={comment.author.image || '/default-avatar.png'}
                                alt={comment.author.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-semibold">{comment.author.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">
                                        {formatDate(comment.createdAt)}
                                    </span>
                                </div>
                                {session?.user?.email === comment.author.email && (
                                    <button
                                        onClick={() => onDeleteComment(comment._id)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-gray-700">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}