import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongoose'
import Comment from '@/models/Comment'

export async function DELETE(
    request: Request,
    { params }: { params: { postId: string; commentId: string } }
) {
    const session = await getServerSession()

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await dbConnect()

    const comment = await Comment.findOne({
        _id: params.commentId,
        post: params.postId
    }).populate('author', 'email')

    if (!comment) {
        return NextResponse.json({ error: 'Comentário não encontrado' }, { status: 404 })
    }

    if (comment.author.email !== session.user.email) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    await comment.deleteOne()

    return NextResponse.json({ message: 'Comentário deletado com sucesso' })
}