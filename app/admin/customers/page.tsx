'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from 'next/navigation'

type Customer = {
  id: number
  name: string
  email: string
  createdAt: string
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
    } else {
      fetchCustomers()
    }
  }, [user, router])

  const fetchCustomers = async () => {
    // 실제 API 호출로 대체해야 합니다
    const response = await fetch('/api/admin/customers')
    const data = await response.json()
    setCustomers(data)
  }

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">고객 관리</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>고객 ID</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>가입일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{new Date(customer.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}