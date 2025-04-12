import { Croissant, ShoppingCart, User } from "lucide-react"
import Link from "next/link"

const Header = () => {
  return (
   <header className="flex justify-between items-center p-4 bg-secondary text-text shadow-md">
  <div className="flex items-center space-x-2">
    <Croissant className="text-primary" />
    <p className="hidden md:flex font-semibold">Culture Pain Terville</p>
  </div>

  <nav>
    <ul className="flex space-x-4">
      <li><Link href="/cart"><ShoppingCart className="text-text hover:text-primary transition" /></Link></li>
      <li><Link href="/profile"><User className="text-text hover:text-primary transition" /></Link></li>
    </ul>
  </nav>
</header>

  )
}

export default Header