'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from 'lucide-react'

type Review = {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

type ProductReviewsProps = {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const [hasPurchased, setHasPurchased] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('리뷰 불러오기 오류:', error)
    }
  }, [productId])

  const checkPurchaseStatus = useCallback(async () => {
    if (user) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases?userId=${user.id}&productId=${productId}`)

        if (response.ok) {
          const data = await response.json()
          setHasPurchased(data.hasPurchased)
        }
      } catch (error) {
        console.error('구매 상태 확인 오류:', error)
      }
    }
  }, [user, productId])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchReviews()
      await checkPurchaseStatus()
      setIsLoading(false)
    }
    loadData()
  }, [fetchReviews, checkPurchaseStatus])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: user.id,
          userName: user.name,
          rating: newReview.rating,
          comment: newReview.comment
        })
      })

      if (response.ok) {
        await fetchReviews()
        setNewReview({ rating: 0, comment: '' })
      }
    } catch (error) {
      console.error('리뷰 제출 오류:', error)
    }
  }

  if (isLoading) {
    return <div>리뷰를 불러오는 중...</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">리뷰</h2>
      {reviews.length === 0 ? (
        <p>아직 리뷰가 없습니다.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="mb-4 p-4 border rounded-lg">
            <div className="flex items-center mb-2">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{review.userName}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p>{review.comment}</p>
          </div>
        ))
      )}

      {user && hasPurchased && (
        <form onSubmit={handleSubmitReview} className="mt-4">
          <h3 className="text-lg font-semibold mb-2">리뷰 작성</h3>
          <div className="mb-2">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
              >
                <Star
                  className={`h-6 w-6 ${
                    i < newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="리뷰를 작성해주세요..."
            className="mb-2"
          />
          <Button type="submit">리뷰 제출</Button>
        </form>
      )}
    </div>
  )
}