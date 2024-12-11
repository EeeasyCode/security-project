'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log('Redirecting to login...');
        router.push('/login'); // 로그인이 필요한 경우 로그인 페이지로 이동
      } else if (user[0].role !== 'admin') {
        console.log(user[0].role)
        console.log('Redirecting to home...');
        router.push('/'); // 관리자가 아닌 경우 홈으로 이동
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 로딩 메시지 표시
  }

  if (!user || user[0].role !== 'admin') {
    return null; // 사용자 권한이 없는 경우 아무것도 렌더링하지 않음
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
  );
}
