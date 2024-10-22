import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import ProfileClient from '@/components/pages/ProfileClient'

export default async function ProfilePage() {
    const session = await getServerSession()

    if (!session) {
        redirect('/')
    }

    return <ProfileClient />
}