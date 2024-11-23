'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'

type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
  category: 'Top' | 'Bottom' | 'Jacket' | 'ACC';
  sizes: string[];
  colors: string[];
};

export default function CategoryPage() {
  const params = useParams()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
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

    fetchProducts()
  }, [])

  const categoryProducts = products.filter(
    product => product.category.toLowerCase() === params.category
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{params.category} Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-lg mb-2">${product.price}</p>
                <p className="text-gray-500 text-sm">{product.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}