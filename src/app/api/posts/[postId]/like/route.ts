import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongoose'
import Post from '@/models/Post'
import User from '@/models/User'

export async function GET(request: Request, { params }: { params: { postId: string } }) {
    await dbConnect()

    const post = await Post.findById(params.postId).populate('likes', 'name email')

    if (!post) {
        return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ likes: post.likes })
}


export async function POST(request: Request, { params }: { params: { postId: string } }) {
    const session = await getServerSession()

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const post = await Post.findById(params.postId)

    if (!post) {
        return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }

    const userIndex = post.likes.indexOf(user._id)

    if (userIndex > -1) {
        post.likes.splice(userIndex, 1)
    } else {
        post.likes.push(user._id)
    }

    await post.save()

    const updatedPost = await Post.findById(params.postId).populate('likes', 'name email')

    return NextResponse.json({
        message: userIndex > -1 ? 'Like removido com sucesso' : 'Post curtido com sucesso',
        likes: updatedPost.likes,
        userLiked: userIndex === -1
    })
}