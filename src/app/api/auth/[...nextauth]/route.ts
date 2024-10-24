import NextAuth, { DefaultSession } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"]
    }
}

const handler = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
            httpOptions: {
                timeout: 15000,
            }
        })
    ],
    callbacks: {
        async signIn({ user }) {
            await dbConnect()
            const existingUser = await User.findOne({ email: user.email })
            if (!existingUser) {
                await User.create({
                    name: user.name,
                    email: user.email,
                    image: user.image
                })
            }
            return true;
        },

        async session({ session }) {
            await dbConnect()
            if (session.user?.email) {
                const dbUser = await User.findOne({ email: session.user?.email })
                if (dbUser) {
                    session.user.id = dbUser._id.toString()
                }
            }

            return session
        }
    }
})

export { handler as GET, handler as POST }