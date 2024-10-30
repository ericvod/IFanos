import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { ApiError, handleApiError } from '@/lib/errors'
import { withAuth } from '@/lib/middleware'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    return withAuth(async (req, session) => {
        try {
            await dbConnect()

            const user = await User.findOne({
                $or: [
                    { _id: params.userId },
                    { email: session.user.email }
                ]
            }).select('-password')

            if (!user) {
                throw new ApiError('Usuário não encontrado', 404)
            }

            return NextResponse.json<ApiResponse<typeof user>>({
                data: user,
                status: 200
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}