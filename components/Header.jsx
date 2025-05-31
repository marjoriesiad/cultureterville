import { Croissant, ShoppingCart, User } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-gray text-beige flex items-center justify-between p-4 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.3)] backdrop-blur-sm bg-opacity-80">
            <div className="flex items-center gap-2">
                <Croissant className='text-red' />
                <span className="hidden md:flex uppercase font-bold">Culture Pain Terville</span>
            </div>
            <nav className="flex items-center gap-4">
                <ShoppingCart />
                <User />
            </nav>
        </header>
    )
}