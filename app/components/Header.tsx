'use client'

import { Search, ShoppingCart, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

const categories = ['All', 'Top', 'Bottom', 'Jacket', 'ACC'] as const

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            Project shop
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8 mx-12">
            {categories.map((category) => (
              <Link
                key={category}
                href={category === 'All' ? '/' : `/category/${category.toLowerCase()}`}
                className={`text-base hover:text-gray-600 transition-colors ${
                  (category === 'All' && pathname === '/') ||
                  pathname === `/category/${category.toLowerCase()}`
                    ? 'text-primary font-medium'
                    : 'text-gray-600'
                }`}
              >
                {category}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 w-full border-gray-200"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gray-50"
                onClick={() => router.push('/cart')}
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
              </Button>
              {user ? (
                <Button 
                  variant="outline" 
                  className="font-medium"
                  onClick={logout}
                >
                  Logout
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="font-medium"
                  onClick={() => router.push('/login')}
                >
                  Sign in
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-gray-50"
                onClick={() => router.push('/mypage')}
              >
                <User className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}