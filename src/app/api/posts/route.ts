import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { ApiError, handleApiError } from '@/lib/errors'
import { withAuth } from '@/lib/middleware'
import dbConnect from '@/lib/mongoose'
import Post from '@/models/Post'
import User from '@/models/User'

export async function GET(request: Request) {
    return withAuth(async (req, session) => {
        try {
            await dbConnect()

            const currentUser = await User.findOne({ email: session.user.email })

            if (!currentUser) {
                return NextResponse.json<ApiResponse<[]>>({
                    data: [],
                    status: 200
                })
            }

            const posts = await Post.find({
                $or: [
                    { author: { $in: currentUser.following } },
                    { author: currentUser._id }
                ]
            })
                .sort({ createdAt: -1 })
                .populate('author', '_id name email image')
                .populate('likes', '_id name email')

            return NextResponse.json<ApiResponse<typeof posts>>({
                data: posts,
                status: 200
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}

export async function POST(request: Request) {
    return withAuth(async (request, session) => {
        try {
            const { content } = await request.json()

            await dbConnect()

            const user = await User.findOne({ email: session.user.email })

            if (!user) {
                throw new ApiError('Usuário não encontrado', 404)
            }

            const post = await Post.create({
                content,
                author: user._id,
            })

            return NextResponse.json<ApiResponse<typeof post>>({
                data: post,
                status: 201,
                message: 'Post criado com sucesso'
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}

export async function PUT(request: Request) {
    return withAuth(async (req, session) => {
        try {
            const { id, content } = await req.json()

            await dbConnect()

            const user = await User.findOne({ email: session.user?.email })

            if (!user) {
                throw new ApiError('Usuário não encontrado', 404)
            }

            const post = await Post.findById(id)

            if (!post) {
                throw new ApiError('Post não encontrado', 404)
            }

            if (post.author.toString() !== user._id.toString()) {
                throw new ApiError('Não autorizado a editar este post', 403)
            }

            post.content = content
            post.updatedAt = new Date()
            await post.save()

            return NextResponse.json<ApiResponse<typeof post>>({
                data: post,
                status: 200,
                message: 'Post atualizado com sucesso'
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}

export async function DELETE(request: Request) {
    return withAuth(async (req, session) => {
        try {
            const { id } = await req.json()

            await dbConnect()

            const user = await User.findOne({ email: session.user?.email })

            if (!user) {
                throw new ApiError('Usuário não encontrado', 404)
            }

            const post = await Post.findById(id)

            if (!post) {
                throw new ApiError('Post não encontrado', 404)
            }

            if (post.author.toString() !== user._id.toString()) {
                throw new ApiError('Não autorizado a deletar este post', 403)
            }

            await post.deleteOne()

            return NextResponse.json<ApiResponse<void>>({
                status: 200,
                message: 'Post deletado com sucesso'
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}