"use client";
import { useState } from "react";
import {
  Croissant,
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  // Simule l'état de connexion et admin
  const isSignedIn = true;
  const isAdmin = true;

  const toggleMenu = () => setShowMenu((prev) => !prev);

  return (
    <header className="bg-gray text-beige flex items-center justify-between p-4 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.3)] backdrop-blur-sm bg-opacity-80">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Croissant className="text-red" />
        </Link>

        <span className="hidden md:flex uppercase font-bold">
          Culture Pain Terville
        </span>
      </div>

      <nav className="flex items-center gap-4 relative">
        <ShoppingCart />

        {/* Icone Admin */}
        {isSignedIn && isAdmin && (
          <Link href="/admin" className="hover:text-yellow-300">
            <Settings />
          </Link>
        )}

        {/* Dropdown User */}
        <div className="relative">
          <button onClick={toggleMenu} className="cursor-pointer">
            <User />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-50">
              {isSignedIn ? (
                <>
                  <Link
                    href="/parametres"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Paramètres
                  </Link>
                  <Link
                    href="/commandes"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Commandes
                  </Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
