import { NextResponse } from 'next/server'
import { getServerSession, Session } from 'next-auth'

export async function withAuth(
    handler: (req: Request, session: Session) => Promise<NextResponse>,
    req: Request
) {
    const session = await getServerSession()

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Não Autorizado' }, { status: 401 })
    }

    return handler(req, session)
}