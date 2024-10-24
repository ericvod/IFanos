import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { ApiError, handleApiError } from '@/lib/errors'
import { withAuth } from '@/lib/middleware'
import dbConnect from '@/lib/mongoose'
import Comment from '@/models/Comment'

export async function DELETE(
    request: Request,
    { params }: { params: { postId: string; commentId: string } }
) {
    return withAuth(async (req, session) => {
        try {
            await dbConnect()

            const comment = await Comment.findOne({
                _id: params.commentId,
                post: params.postId
            }).populate('author', 'email')

            if (!comment) {
                throw new ApiError('Comentário não encontrado', 404)
            }

            if (comment.author.email !== session.user?.email) {
                throw new ApiError('Não autorizado a deletar este comentário', 403)
            }

            await comment.deleteOne()

            return NextResponse.json<ApiResponse<void>>({
                status: 200,
                message: 'Comentário deletado com sucesso'
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}