'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from 'next/navigation'

type Order = {
  id: number
  userId: number
  userName: string
  total: number
  status: string
  createdAt: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
    } else {
      fetchOrders()
    }
  }, [user, router])

  const fetchOrders = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`)
    const data = await response.json()
    console.log(data)
    setOrders(data)
  }

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">주문 관리</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>주문 ID</TableHead>
            <TableHead>고객 ID</TableHead>
            <TableHead>고객명</TableHead>
            <TableHead>총 금액</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>주문일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.userId}</TableCell>
              <TableCell>{order.userName}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}