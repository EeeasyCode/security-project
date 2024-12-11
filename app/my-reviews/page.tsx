'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Star } from 'lucide-react'

type Review = {
  id: string
  productId: number
  productName: string
  rating: number
  comment: string
  createdAt: string
  isPrivate: boolean
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/user/${user[0].id}`)
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          if (Array.isArray(data.reviews)) {
            setReviews(data.reviews)
          } else {
            console.error('리뷰 데이터 형식 오류:', data)
            setReviews([])
          }
        } else {
          console.error('API 응답 오류:', response.statusText)
        }
      } catch (error) {
        console.error('리뷰 불러오기 오류:', error)
      }
    }

    fetchReviews()
  }, [user])

  useEffect(() => {
    console.log(reviews)
  }, [reviews])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">내 리뷰 히스토리</h1>
      {reviews.length === 0 ? (
        <p>작성한 리뷰가 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{review.productName}</h2>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2">{review.comment}</p>
              {review.isPrivate && (
                <span className="text-sm text-gray-500 mt-2 block">비공개 리뷰</span>
              )}
              <Button variant="outline" className="mt-4" onClick={() => {/* 수정 기능 구현 */}}>
                수정
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}