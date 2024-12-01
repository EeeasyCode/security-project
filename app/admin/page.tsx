'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, MessageSquare } from 'lucide-react'

export default function AdminDashboard() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
  
    useEffect(() => {
      // 로딩 중이 아닐 때만 리다이렉트 로직 실행
      if (!isLoading) {
        if (user && user.role !== 'admin') {
          router.push('/')
        } else if (!user) {
          router.push('/login')
        }
      }
    }, [user, router, isLoading])
  
    // 로딩 중이거나 admin이 아닌 경우 null 반환
    if (isLoading || !user || user.role !== 'admin') {
      return <div>Loading...</div>
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>상품 관리</CardTitle>
            <CardDescription>상품 등록, 수정, 삭제</CardDescription>
          </CardHeader>
          <CardContent>
            <Package className="h-12 w-12 mb-4 text-primary" />
            <Link href="/admin/products">
              <Button className="w-full">상품 관리</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>주문 관리</CardTitle>
            <CardDescription>고객 주문 정보 확인</CardDescription>
          </CardHeader>
          <CardContent>
            <ShoppingCart className="h-12 w-12 mb-4 text-primary" />
            <Link href="/admin/orders">
              <Button className="w-full">주문 관리</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>고객 관리</CardTitle>
            <CardDescription>고객 정보 확인</CardDescription>
          </CardHeader>
          <CardContent>
            <Users className="h-12 w-12 mb-4 text-primary" />
            <Link href="/admin/customers">
              <Button className="w-full">고객 관리</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>QnA 관리</CardTitle>
            <CardDescription>문의 확인 및 답변</CardDescription>
          </CardHeader>
          <CardContent>
            <MessageSquare className="h-12 w-12 mb-4 text-primary" />
            <Link href="/admin/qna">
              <Button className="w-full">QnA 관리</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}