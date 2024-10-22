import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import HomePageClient from "@/components/pages/HomePageClient"

export default async function HomePage() {
    const session = await getServerSession()

    if (!session) {
        redirect('/')
    }

    return <HomePageClient />
}