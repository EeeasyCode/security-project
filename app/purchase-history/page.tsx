'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { format } from 'date-fns'

type PurchaseHistory = {
  id: string
  userId: string
  productId: number
  createdAt: string
  hasReview: boolean
  address: string
  items: {
    color: string
    product: {
      id: number
      name: string
      image: string
      price: number
      category: string
      colors: string[]
      description: string
      sizes: string[]
    }
    quantity: number
    size: string
  }[]
  total: number
}

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!user) return
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/history?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setPurchases(data)
        }
      } catch (error) {
        console.error('구매 내역 불러오기 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPurchaseHistory()
  }, [user])

  const handleReviewClick = (productId: number) => {
    router.push(`/write-review/${productId}`)
  }

  if (isLoading) {
    return <div className="p-4">로딩 중...</div>
  }

  if (!user) {
    return <div className="p-4">로그인이 필요합니다.</div>
  }

  // 날짜별로 구매 내역 그룹화
  const purchasesByDate = purchases.reduce((acc, purchase) => {
    const date = format(new Date(purchase.createdAt), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(purchase)
    return acc
  }, {} as Record<string, PurchaseHistory[]>)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">구매 내역</h1>
      </div>

      {Object.entries(purchasesByDate).map(([date, datePurchases]) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{date}</h2>
          <div className="space-y-4">
            {datePurchases.map((purchase) => (
              <div key={purchase.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  
                  <div className="relative w-20 h-20">
                    <Image
                      src={purchase.items[0].product.image}
                      alt={purchase.items[0].product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{purchase.items[0].product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${purchase.items[0].product.price}
                    </p>
                  </div>
                  {!purchase.hasReview && (
                    <Button
                      onClick={() => handleReviewClick(purchase.items[0].product.id)}
                      variant="outline"
                    >
                      리뷰 작성
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {purchases.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          구매 내역이 없습니다.
        </div>
      )}
    </div>
  )
}