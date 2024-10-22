import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongoose'
import Post from '@/models/Post'
import User from '@/models/User'

export async function GET() {
    await dbConnect()
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('author', '_id name email image')
        .populate('likes', '_id name email')
    return NextResponse.json(posts)
}

export async function POST(request: Request) {
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

    const post = new Post({
        content,
        author: user._id,
    })

    await post.save()
    return NextResponse.json(post, { status: 201 })
}

export async function PUT(request: Request) {
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Não Autorizado' }, { status: 401 })
    }

    const { id, content } = await request.json()

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const post = await Post.findById(id)

    if (!post) {
        return NextResponse.json({ erro: 'Post não encontrado' }, { status: 404 })
    }

    if (post.author.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Não autorizado a editar este post' }, { status: 403 })
    }

    post.content = content
    post.updatedAt = new Date()
    await post.save()

    return NextResponse.json(post)
}

export async function DELETE(request: Request) {
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await request.json()

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const post = await Post.findById(id)

    if (!post) {
        return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }

    if (post.author.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Não autorizado a deletar este post' }, { status: 403 })
    }

    await post.deleteOne()

    return NextResponse.json({ message: 'Post deletado com sucesso' })
}