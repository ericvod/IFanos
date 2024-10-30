import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { ApiError, handleApiError } from '@/lib/errors'
import { withAuth } from '@/lib/middleware'
import dbConnect from '@/lib/mongoose'
import Comment from '@/models/Comment'
import User from '@/models/User'

export async function POST(
    request: Request,
    { params }: { params: { postId: string; commentId: string } }
) {
    return withAuth(async (req, session) => {
        try {
            await dbConnect()

            const user = await User.findOne({ email: session.user?.email })

            if (!user) {
                throw new ApiError('Usuário não encontrado', 404)
            }

            const comment = await Comment.findOne({
                _id: params.commentId,
                post: params.postId
            })

            if (!comment) {
                throw new ApiError('Comentário não encontrado', 404)
            }

            const userLikeIndex = comment.likes.indexOf(user._id)

            if (userLikeIndex > -1) {
                comment.likes.splice(userLikeIndex, 1)
            } else {
                comment.likes.push(user._id)
            }

            await comment.save()

            const updatedComment = await Comment.findById(comment._id)
                .populate('author', 'name email image')
                .populate('likes', 'name email')

            return NextResponse.json<ApiResponse<typeof updatedComment>>({
                data: updatedComment,
                status: 200,
                message: userLikeIndex > -1 ? 'Like removido com sucesso' : 'Comentário curtido com sucesso'
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}