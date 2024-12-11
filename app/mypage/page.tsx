'use client'

import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'

export default function MyPage() {
  const { user } = useAuth()

  if (!user) {
    return <div className="p-4">로그인이 필요합니다.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>내 정보</CardTitle>
            <CardDescription>회원 정보를 확인하고 수정할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2">이름: {user[0].name}</p>
            <p className="mb-4">이메일: {user[0].email}</p>
            <Link href="/edit-profile">
              <Button variant="outline">정보 수정</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>구매 내역 및 리뷰</CardTitle>
            <CardDescription>구매한 상품을 확인하고 리뷰를 작성할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/purchase-history">
              <Button className="w-full" variant="outline">
                <ShoppingBag className="mr-2 h-4 w-4" />
                구매 내역 보기
              </Button>
            </Link>
            <Link href="/purchase-history">
              <Button className="w-full" variant="outline">
                <Star className="mr-2 h-4 w-4" />
                리뷰 작성하기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}