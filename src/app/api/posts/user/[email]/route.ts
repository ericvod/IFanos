import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import dbConnect from '@/lib/mongoose'
import Post from '@/models/Post'
import User from '@/models/User'

export async function GET(request: Request, { params }: { params: { email: string } }) {
    const session = await getServerSession()

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    if (session.user.email !== params.email) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    await dbConnect()

    const user = await User.findOne({ email: params.email })

    if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 })

    return NextResponse.json(posts)
}