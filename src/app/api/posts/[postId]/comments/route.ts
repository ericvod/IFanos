import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { ApiError, handleApiError } from '@/lib/errors'
import { withAuth } from '@/lib/middleware'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import Comment from '@/models/Comment'

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    try {
        await dbConnect()

        const comments = await Comment.find({ post: params.postId })
            .sort({ createdAt: -1 })
            .populate('author', 'name email image')
            .populate('likes', 'name email image')

        return NextResponse.json<ApiResponse<typeof comments>>({
            data: comments,
            status: 200
        })
    } catch (error) {
        return handleApiError(error)
    }
}

export async function POST(
    request: Request,
    { params }: { params: { postId: string } }
) {
    return withAuth(async (req, session) => {
        try {
            const { content } = await req.json()

            await dbConnect()

            const user = await User.findOne({ email: session.user?.email })

            if (!user) {
                throw new ApiError('Usuário não encontrado', 404)
            }

            const comment = await Comment.create({
                content,
                post: params.postId,
                author: user._id,
            })

            const populatedComment = await Comment.findById(comment._id)
                .populate('author', 'name email image')

            return NextResponse.json<ApiResponse<typeof populatedComment>>({
                data: populatedComment,
                status: 201,
                message: 'Comentário criado com sucesso'
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}