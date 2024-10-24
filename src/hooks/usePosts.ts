import { useState, useCallback, useEffect, useRef } from 'react'
import { Post, Comment } from '@/types'

export const usePosts = (initialPosts: Post[] = []) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts)
    const [editingPost, setEditingPost] = useState<Post | null>(null)
    const [content, setContent] = useState('')
    const [comments, setComments] = useState<{ [key: string]: Comment[] }>({})
    const [isLoading, setIsLoading] = useState(false)
    
    const initialFetchDone = useRef(false)

    const fetchPosts = useCallback(async () => {
        if (isLoading) return

        setIsLoading(true)

        try {
            const response = await fetch('/api/posts')
            if (response.ok) {
                const json = await response.json()
                setPosts(json.data || [])
            }
        } catch (error) {
            console.error('Erro ao buscar posts:', error)
            setPosts([])
        } finally {
            setIsLoading(false)
        }
    }, [isLoading])

    useEffect(() => {
        if (!initialFetchDone.current) {
            initialFetchDone.current = true
            fetchPosts()
        }
    }, [fetchPosts])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        try {
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
        } catch (error) {
            console.error('Erro ao criar post:', error)
        }
    }

    const handleEdit = (post: Post) => {
        setEditingPost(post)
        setContent(post.content)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPost || !content.trim()) return

        try {
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
        } catch (error) {
            console.error('Erro ao atualizar post:', error)
        }
    }

    const handleDelete = async (postId: string) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: postId }),
            })
            if (response.ok) {
                fetchPosts()
            }
        } catch (error) {
            console.error('Erro ao deletar post:', error)
        }
    }

    const handleLike = async (postId: string) => {
        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
            })
            if (response.ok) {
                const { data: updatedLikes } = await response.json()
                setPosts(currentPosts =>
                    currentPosts.map(post =>
                        post._id === postId ? { ...post, likes: updatedLikes } : post
                    )
                )
            }
        } catch (error) {
            console.error('Erro ao curtir post:', error)
        }
    }

    const fetchComments = useCallback(async (postId: string) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`)
            if (response.ok) {
                const { data } = await response.json()
                setComments(prev => ({
                    ...prev,
                    [postId]: data
                }))
            }
        } catch (error) {
            console.error('Erro ao buscar comentários:', error)
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
                const { data: newComment } = await response.json()
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