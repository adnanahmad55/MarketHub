"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchQuery.trim() ? `/?search=${searchQuery}` : "/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-black text-blue-600 flex-shrink-0">
          MarketHub 🛒
        </Link>

        {/* 🔍 Search Bar (Center) */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg relative hidden md:block">
          <input
            type="text"
            placeholder="Search for magic..."
            className="w-full bg-gray-100 border-none px-5 py-2.5 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 text-black transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-4 top-2.5 opacity-40">🔍</button>
        </form>

        {/* Action Buttons (Right) */}
        <div className="flex items-center gap-5">
          <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/orders" className="text-sm font-semibold text-gray-600 hover:text-blue-600">My Orders</Link>
              <Link 
                href={(session.user as any).role === "ADMIN" ? "/dashboard" : "/seller"} 
                className="bg-black text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition"
              >
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="text-sm font-bold text-red-500 hover:text-red-600">Exit</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}