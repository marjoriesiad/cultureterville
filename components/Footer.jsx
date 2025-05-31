import Link from "next/link"

export default function Footer(){
  return (
    <footer className="bg-gray text-beige w-full shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)] border-t border-white/10 p-6 text-sm relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        {/* Navigation */}
        <nav className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
          <Link href="/" className="hover:text-primary transition">Contact</Link>
          <Link href="/" className="hover:text-primary transition">Conditions générales de vente</Link>
          <Link href="/" className="hover:text-primary transition">Cookies & Confidentialité</Link>
        </nav>

        {/* Infos */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="font-semibold hover:text-primary transition">
            Culture Pain Terville
          </Link>
          <span className="text-xs text-white/60">© 2025</span>
        </div>
      </div>
    </footer>
  )
}
