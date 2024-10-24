import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { ApiError, handleApiError } from '@/lib/errors'
import { withAuth } from '@/lib/middleware'
import dbConnect from '@/lib/mongoose'
import Post from '@/models/Post'
import User from '@/models/User'

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    try {
        await dbConnect()

        const post = await Post.findById(params.postId).populate('likes', 'name email')

        if (!post) {
            throw new ApiError('Post não encontrado', 404)
        }

        return NextResponse.json<ApiResponse<typeof post.likes>>({
            data: post.likes,
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
    return withAuth(async (request, session) => {
        try {
            await dbConnect()

            const user = await User.findOne({ email: session.user?.email })

            if (!user) {
                throw new ApiError('Usuário não encontrado', 404)
            }

            const post = await Post.findById(params.postId)

            if (!post) {
                throw new ApiError('Post não encontrado', 404)
            }

            const userIndex = post.likes.indexOf(user._id)

            if (userIndex > -1) {
                post.likes.splice(userIndex, 1)
            } else {
                post.likes.push(user._id)
            }

            await post.save()

            const updatedPost = await Post.findById(params.postId)
                .populate('likes', 'name email')

            return NextResponse.json<ApiResponse<typeof updatedPost.likes>>({
                data: updatedPost.likes,
                status: 200,
                message: userIndex > -1 ? 'Like removido com sucesso' : 'Post curtido com sucesso'
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}