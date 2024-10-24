import { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { FaTimes } from 'react-icons/fa'
import { Modal } from '../ui/Modal'
import type { Post, Comment } from '@/types'

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post;
    comments: Comment[];
    onAddComment: (content: string) => Promise<boolean>;
    onDeleteComment: (commentId: string) => Promise<boolean>;
}

export function CommentModal({
    isOpen,
    onClose,
    post,
    comments,
    onAddComment,
    onDeleteComment
}: CommentModalProps) {
    const { data: session } = useSession()
    const [newComment, setNewComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const success = await onAddComment(newComment)
            if (success) {
                setNewComment('')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR')
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col max-h-[calc(100vh-4rem)]">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Comentários</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex items-start space-x-3">
                        <Image
                            src={post.author.image || ''}
                            alt={post.author.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <div>
                            <h3 className="font-semibold">{post.author.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(post.createdAt)}
                            </p>
                        </div>
                    </div>
                    <p className="mt-3">{post.content}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.map(comment => (
                        <div
                            key={comment._id}
                            className="flex space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                            <Image
                                src={comment.author.image || ''}
                                alt={comment.author.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold">
                                            {comment.author.name}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    {session?.user?.email === comment.author.email && (
                                        <button
                                            onClick={() => onDeleteComment(comment._id)}
                                            className="text-gray-500 hover:text-red-500 dark:text-gray-400"
                                        >
                                            <FaTimes size={16} />
                                        </button>
                                    )}
                                </div>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {session && (
                    <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
                        <div className="flex space-x-3">
                            <Image
                                src={session.user.image || ''}
                                alt={session.user.name || ''}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Escreva um comentário..."
                                    className="w-full p-2 border dark:border-gray-600 rounded-lg resize-none dark:bg-gray-700 dark:text-gray-100"
                                    rows={2}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Comentar'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    )
}