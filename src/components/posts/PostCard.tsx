import React, { useEffect, useState } from 'react'
import { FaEllipsisV, FaEdit, FaTrash, FaHeart } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { Tooltip } from 'react-tooltip'
import Image from 'next/image'
import CommentSection from './CommentSection'
import { usePosts } from '@/hooks/usePosts'

interface PostProps {
    post: {
        _id: string
        content: string
        author: {
            _id: string
            name: string
            email: string
            image?: string
        }
        likes: Array<{
            _id: string
            name: string
            email: string
        }>
        createdAt: string
        updatedAt: string
    }
    onEdit: (post: PostProps['post']) => void
    onDelete: (postId: string) => void
    onLike: (postId: string) => void
}

export default function PostCard({ post, onEdit, onDelete, onLike }: PostProps) {
    const { data: session } = useSession()
    const [showMenu, setShowMenu] = useState(false)
    const [showLikes, setShowLikes] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const userLiked = post.likes.some(like => like.email === session?.user?.email)
    const isAuthor = session?.user?.email === post.author.email
    const {
        comments,
        fetchComments,
        addComment,
        deleteComment
    } = usePosts()

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('pt-BR')
    };

    const handleLikeClick = () => {
        onLike(post._id)
    };

    const toggleLikes = () => {
        setShowLikes(!showLikes);
    };

    const tooltipContent = post.likes.length > 0
        ? post.likes.map(user => user.name).join(', ')
        : 'Ninguém curtiu ainda';

    useEffect(() => {
        if (showComments) {
            fetchComments(post._id)
        }
    }, [showComments, post._id])

    return (
        <div className="mb-4 p-4 border rounded relative">
            <div className="flex items-start mb-3">
                <div className="mr-3">
                    <Image
                        src={post.author.image || ''}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                </div>
                <div>
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <p className="text-xs text-gray-500">
                        Publicado em: {formatDate(post.createdAt)}
                        {post.updatedAt !== post.createdAt && ` • Editado em: ${formatDate(post.updatedAt)}`}
                    </p>
                </div>
                {isAuthor && (
                    <div className="ml-auto">
                        <button onClick={() => setShowMenu(!showMenu)} className="text-gray-500">
                            <FaEllipsisV />
                        </button>
                        {showMenu && (
                            <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <button onClick={() => onEdit(post)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    <FaEdit className="inline mr-2" /> Editar
                                </button>
                                <button onClick={() => onDelete(post._id)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    <FaTrash className="inline mr-2" /> Excluir
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p className="mb-3">{post.content}</p>
            <div className="flex items-center border-t border-b py-2">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <button
                            onClick={handleLikeClick}
                            className={`${userLiked ? 'text-red-500' : 'text-gray-500'} hover:scale-110 transition-transform`}
                        >
                            <FaHeart className="text-xl" />
                        </button>
                        <span
                            onClick={toggleLikes}
                            className="ml-1 cursor-pointer text-sm"
                            data-tooltip-id={`tooltip-${post._id}`}
                        >
                            {post.likes.length}
                        </span>
                        <Tooltip
                            id={`tooltip-${post._id}`}
                            content={tooltipContent}
                        />
                    </div>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                        {showComments ? 'Ocultar comentários' : 'Comentários'}
                    </button>
                </div>
            </div>
            {showLikes && (
                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <h4 className="font-semibold">Curtido por:</h4>
                    <ul>
                        {post.likes.map(user => (
                            <li key={user._id}>{user.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            {showComments && (
                <CommentSection
                    postId={post._id}
                    comments={comments[post._id] || []}
                    onAddComment={(content) => addComment(post._id, content)}
                    onDeleteComment={(commentId) => deleteComment(post._id, commentId)}
                />
            )}
        </div>
    )
}