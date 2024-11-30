'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star } from 'lucide-react'

type Product = {
  id: number
  name: string
  image: string
}

export default function WriteReviewPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        }
      } catch (error) {
        console.error('상품 정보 불러오기 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
    const checkExistingReview = async () => {
      if (!user || !productId) return
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/check?userId=${user.id}&productId=${productId}`)
        if (response.ok) {
          const { hasReview } = await response.json()
          if (hasReview) {
            alert('이미 이 상품에 대한 리뷰를 작성하셨습니다.')
            router.push('/purchase-history')
          }
        }
      } catch (error) {
        console.error('리뷰 확인 오류:', error)
      }
    }

    checkExistingReview()
  }, [productId, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !product) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userId: user.id,
          userName: user.name,
          rating,
          comment,
          isPrivate
        })
      })

      if (response.ok) {
        alert('리뷰가 등록되었습니다.')
        router.push('/purchase-history')
      }
    } catch (error) {
      console.error('리뷰 등록 오류:', error)
      alert('리뷰 등록에 실패했습니다.')
    }
  }

  if (isLoading) {
    return <div className="p-4">로딩 중...</div>
  }

  if (!product) {
    return <div className="p-4">상품을 찾을 수 없습니다.</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">리뷰 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">상품</label>
          <Select disabled value={product.id.toString()}>
            <SelectTrigger>
              <SelectValue>{product.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={product.id.toString()}>{product.name}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">평점</label>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
              >
                <Star
                  className={`h-6 w-6 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">내용</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="리뷰 내용을 작성해주세요"
            className="min-h-[200px]"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="private"
            checked={isPrivate}
            onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
          />
          <label
            htmlFor="private"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            비공개
          </label>
        </div>

        <div className="flex justify-end">
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  )
}