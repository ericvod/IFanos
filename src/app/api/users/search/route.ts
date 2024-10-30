import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { handleApiError } from '@/lib/errors'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const searchParams = new URLSearchParams(request.url.split('?')[1])
        const query = searchParams.get('q')

        await dbConnect()

        if (!query) {
            return NextResponse.json<ApiResponse<[]>>({
                data: [],
                status: 200
            })
        }

        const users = await User.find({
            name: { $regex: query, $options: 'i' }
        })
        .select('name email image followers')
        .limit(10)

        return NextResponse.json<ApiResponse<typeof users>>({
            data: users,
            status: 200
        })
    } catch (error) {
        return handleApiError(error)
    }
}