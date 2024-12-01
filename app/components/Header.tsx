'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Project shop
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="hover:text-primary">
                All
              </Link>
              <Link href="/category/Top" className="hover:text-primary">
                Top
              </Link>
              <Link href="/category/Bottom" className="hover:text-primary">
                Bottom
              </Link>
              <Link href="/category/Jacket" className="hover:text-primary">
                Jacket
              </Link>
              <Link href="/category/ACC" className="hover:text-primary">
                ACC
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block w-72">
              <Input type="search" placeholder="Search..." className="w-full" />
            </div>

            {user ? (
              <>
                <Link href="/cart">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/mypage">마이페이지</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/purchase-history">구매내역/리뷰</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-reviews">내 리뷰 히스토리</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/qna">QnA</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => router.push('/login')} variant="ghost">
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}