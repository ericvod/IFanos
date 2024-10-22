import { useState, useCallback, useEffect } from 'react'

interface Post {
    _id: string
    content: string
    author: {
        _id: string
        name: string
        email: string
        image?: string
    };
    likes: Array<{
        _id: string
        name: string
        email: string
    }>;
    createdAt: string
    updatedAt: string
}

interface Comment {
    _id: string
    content: string
    author: {
        _id: string
        name: string
        email: string
        image?: string
    }
    createdAt: string
    updatedAt: string
}

export const usePosts = (initialPosts: Post[] = []) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts)
    const [editingPost, setEditingPost] = useState<Post | null>(null)
    const [content, setContent] = useState('')
    const [comments, setComments] = useState<{ [key: string]: Comment[] }>({})

    const fetchPosts = useCallback(async () => {
        const response = await fetch('/api/posts')
        if (response.ok) {
            const data = await response.json()
            setPosts(data)
        }
    }, [])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        })
        if (response.ok) {
            setContent('')
            fetchPosts()
        }
    }

    const handleEdit = (post: Post) => {
        setEditingPost(post)
        setContent(post.content)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPost || !content.trim()) return

        const response = await fetch('/api/posts', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: editingPost._id, content }),
        })
        if (response.ok) {
            setContent('')
            setEditingPost(null)
            fetchPosts()
        }
    }

    const handleDelete = async (postId: string) => {
        const response = await fetch('/api/posts', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: postId }),
        });
        if (response.ok) {
            fetchPosts()
        }
    }

    const handleLike = async (postId: string) => {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST',
        })
        if (response.ok) {
            const updatedPost = await response.json()
            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post._id === postId ? { ...post, likes: updatedPost.likes } : post
                )
            )
        }
    }

    const fetchComments = useCallback(async (postId: string) => {
        const response = await fetch(`/api/posts/${postId}/comments`)
        if (response.ok) {
            const data = await response.json()
            setComments(prev => ({
                ...prev,
                [postId]: data
            }))
        }
    }, [])


    const addComment = useCallback(async (postId: string, content: string) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            })

            if (response.ok) {
                const newComment = await response.json()
                setComments(prev => ({
                    ...prev,
                    [postId]: [newComment, ...(prev[postId] || [])]
                }))
                return true
            }
            return false
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error)
            return false
        }
    }, [])

    const deleteComment = useCallback(async (postId: string, commentId: string) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setComments(prev => ({
                    ...prev,
                    [postId]: prev[postId]?.filter(comment => comment._id !== commentId) || []
                }))
                return true
            }
            return false
        } catch (error) {
            console.error('Erro ao deletar comentário:', error)
            return false
        }
    }, [])

    return {
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
        comments,
        fetchComments,
        addComment,
        deleteComment,
    }
}