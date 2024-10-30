import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { ApiError, handleApiError } from '@/lib/errors'
import { withAuth } from '@/lib/middleware'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(
    request: Request,
    { params }: { params: { userId: string } }
) {
    return withAuth(async (req, session) => {
        try {
            await dbConnect()

            const currentUser = await User.findOne({ email: session.user?.email })

            if (!currentUser) {
                throw new ApiError('Usuário não encontrado', 404)
            }

            const userToFollow = await User.findById(params.userId)

            if (!userToFollow) {
                throw new ApiError('Usuário para seguir não encontrado', 404)
            }

            const isFollowing = currentUser.following.includes(userToFollow._id)

            if (isFollowing) {
                currentUser.following.pull(userToFollow._id)
                userToFollow.followers.pull(currentUser._id)
            } else {
                currentUser.following.push(userToFollow._id)
                userToFollow.followers.push(currentUser._id)
            }

            await Promise.all([currentUser.save(), userToFollow.save()])

            return NextResponse.json<ApiResponse<typeof userToFollow>>({
                data: userToFollow,
                status: 200,
                message: isFollowing
                    ? 'Deixou de seguir com sucesso'
                    : 'Seguindo com sucesso'
            })
        } catch (error) {
            return handleApiError(error)
        }
    }, request)
}