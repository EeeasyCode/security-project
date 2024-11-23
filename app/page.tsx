'use client'

import { useState, useEffect } from 'react'
import { Search, Menu, ShoppingCart, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './contexts/AuthContext'

const categories = ['All', 'Top', 'Bottom', 'Jacket', 'ACC'] as const

type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
  category: "Top" | "Bottom" | "Jacket" | "ACC";
  sizes: string[];
  colors: string[];
};

export default function Home() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('All')
  const router = useRouter()
  const { user, logout } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUserIconClick = () => {
    if (user) {
      router.push('/mypage')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="w-full">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <div className="text-2xl font-bold shrink-0">
              <Link href="/">Project shop</Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-base font-medium hover:text-gray-600 ${
                    selectedCategory === category ? 'text-primary' : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="hidden lg:block relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9 pr-4"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* Shopping Cart Button */}
                <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => router.push('/cart')}>
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {user ? (
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => router.push('/login')}>
                    Login
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={handleUserIconClick}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="lg:hidden p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-4 w-full"
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100" />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-lg mb-2">${product.price}</p>
                  <p className="text-gray-500 text-sm">{product.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}