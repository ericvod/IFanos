import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongoose'
import Comment from '@/models/Comment'
import User from '@/models/User'

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    await dbConnect()

    const comments = await Comment.find({ post: params.postId })
        .sort({ createdAt: -1 })
        .populate('author', 'name email image')

    return NextResponse.json(comments)
}

export async function POST(
    request: Request,
    { params }: { params: { postId: string } }
) {
    const session = await getServerSession()

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { content } = await request.json()

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const comment = new Comment({
        content,
        post: params.postId,
        author: user._id,
    })

    await comment.save()

    const populatedComment = await Comment.findById(comment._id)
        .populate('author', 'name email image')

    return NextResponse.json(populatedComment, { status: 201 })
}