import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { ApiError, handleApiError } from '@/lib/errors'
import { withAuth } from '@/lib/middleware'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function GET(request: Request, { params }: { params: { email: string } }) {
    return withAuth(async (req, session) => {
        try {
            if (session.user?.email !== params.email) {
                throw new ApiError('Não autorizado', 403)
            }

            await dbConnect()

            const user = await User.findOne({ email: params.email }).select('-password')

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