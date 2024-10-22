import Link from 'next/link'
import ButtonLogout from '../auth/ButtonLogout'

export default function Header() {
    return (
        <header className="w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="text-xl font-bold ml-2">IFanos</span>
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link href="/home">Home</Link></li>
                        <li><Link href="/profile">Perfil</Link></li>
                        <li><Link href="/communities">Comunidades</Link></li>
                    </ul>
                </nav>
                <div>
                    <ButtonLogout />
                </div>
            </div>
        </header>
    )
}