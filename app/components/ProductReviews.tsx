'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Star } from 'lucide-react'

type Review = {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  isPrivate: boolean
}

type ProductReviewsProps = {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', isPrivate: false })
  const [canReview, setCanReview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const fetchReviews = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?productId=${productId}&userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setCanReview(data.canReview)
      }
    } catch (error) {
      console.error('리뷰 불러오기 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }, [productId, user])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !canReview) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: user.id,
          userName: user.name,
          rating: newReview.rating,
          comment: newReview.comment,
          isPrivate: newReview.isPrivate
        })
      })

      if (response.ok) {
        await fetchReviews()
        setNewReview({ rating: 0, comment: '', isPrivate: false })
      }
    } catch (error) {
      console.error('리뷰 제출 오류:', error)
    }
  }

  if (isLoading) {
    return <div>리뷰를 불러오는 중...</div>
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold">리뷰</h2>
      {reviews.length === 0 ? (
        <p>아직 리뷰가 없습니다.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="p-4 border rounded-lg mb-4">
            {(!review.isPrivate || review.userId === user?.id || user?.role === 'admin') && (
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-base">{review.userName}</h3>
                  <div className="flex gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                  {review.isPrivate && (
                    <span className="text-xs text-muted-foreground mt-1 block">비공개 리뷰</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {user && canReview && (
        <form onSubmit={handleSubmitReview} className="border rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-base mb-4">리뷰 작성</h3>
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                >
                  <Star
                    className={`h-5 w-5 ${
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
              className="mb-4"
            />
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="private"
                checked={newReview.isPrivate}
                onCheckedChange={(checked) => setNewReview({ ...newReview, isPrivate: checked as boolean })}
              />
              <label
                htmlFor="private"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                비공개
              </label>
            </div>
            <Button type="submit" className="w-full">리뷰 작성하기</Button>
          </div>
        </form>
      )}
    </div>
  )
}