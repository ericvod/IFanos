import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { handleApiError } from '@/lib/errors'
import dbConnect from '@/lib/mongoose'
import Comment from '@/models/Comment'

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    try {
        await dbConnect()

        const count = await Comment.countDocuments({ post: params.postId })

        return NextResponse.json<ApiResponse<number>>({
            data: count,
            status: 200
        })
    } catch (error) {
        return handleApiError(error)
    }
}