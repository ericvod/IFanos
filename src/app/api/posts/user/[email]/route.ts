import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { ApiError, handleApiError } from '@/lib/errors'
import { withAuth } from '@/lib/middleware'
import dbConnect from '@/lib/mongoose'
import Post from '@/models/Post'
import User from '@/models/User'

export async function GET(request: Request, { params }: { params: { email: string } }) {
    return withAuth(async (req, session) => {
        try {
            if (session.user?.email !== params.email) {
                throw new ApiError('Não autorizado', 403)
            }

            await dbConnect()

            const user = await User.findOne({ email: params.email })

            if (!user) {
                throw new ApiError('Usuário não encontrado', 404)
            }

            const posts = await Post.find({ author: user._id })
                .sort({ createdAt: -1 })
                .populate('author', 'name email image')
                .populate('likes', 'name email')

            return NextResponse.json<ApiResponse<typeof posts>>({
                data: posts,
                status: 200
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}