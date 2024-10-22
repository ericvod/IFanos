import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
// import Image from 'next/image'
import ButtonLogin from '@/components/auth/ButtonLogin'

export default async function Home() {
  const session = await getServerSession()

  if (session) {
    redirect('/home')
  }

  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-green-400 to-blue-500 animate-fadeIn">
      <div className="text-center mb-8">
        {/* <Image
          src="/logo.png"
          alt="IFanos Logo"
          width={150}
          height={150}
        /> */}
        <h1 className="text-5xl font-bold text-white mt-4">IFanos</h1>
        <p className="text-lg text-white mt-2">
          Rede social
        </p>
      </div>
      <ButtonLogin />
    </main>
  );
}
