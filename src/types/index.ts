export interface User {
    _id: string
    name: string
    email: string
    image?: string
}

export interface Post {
    _id: string
    content: string
    author: User
    likes: User[]
    createdAt: string
    updatedAt: string
}

export interface Comment {
    _id: string
    content: string
    author: User
    post: string
    createdAt: string
    updatedAt: string
}

export interface PostCardProps {
    post: Post
    onEdit: (post: Post) => void
    onDelete: (postId: string) => void
    onLike: (postId: string) => void
}

export interface CommentSectionProps {
    postId: string
    comments: Comment[]
    onAddComment: (content: string) => Promise<boolean>
    onDeleteComment: (commentId: string) => Promise<boolean>
}

export interface ApiResponse<T = any> {
    data?: T
    error?: string
    message?: string
    status: number
}