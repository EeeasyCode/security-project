'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useCart } from '@/app/contexts/CartContext'
import { toast } from 'sonner'
import ProductReviews from '@/app/components/ProductReviews'

type Product = {
  id: number
  image: string
  name: string
  price: number
  description: string
  category: "Top" | "Bottom" | "Jacket" | "ACC"
  sizes: string[]
  colors: string[]
}

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return
      
      setIsLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`
        )
        if (!response.ok) {
          throw new Error('상품을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setProduct(data)
        setSelectedSize(data.sizes[0])
        setSelectedColor(data.colors[0])
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error('상품 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    
    if (!selectedSize || !selectedColor) {
      toast.error('사이즈와 색상을 선택해주세요.')
      return
    }
    
    addToCart(product, 1, selectedSize, selectedColor)
    toast.success('상품이 장바구니에 추가되었습니다.')
  }

  if (isLoading) {
    return <div className="p-8 text-center">로딩 중...</div>
  }

  if (!product) {
    return <div className="p-8 text-center">상품을 찾을 수 없습니다.</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-4xl font-bold mt-2">${product.price}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사이즈
              </label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="사이즈 선택" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                색상
              </label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="색상 선택" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleAddToCart}
            >
              장바구니에 추가
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>상품 설명</AccordionTrigger>
              <AccordionContent>{product.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>배송 정보</AccordionTrigger>
              <AccordionContent>
                10만원 이상 구매 시 무료배송. 배송기간 3-5일 소요.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  )
}