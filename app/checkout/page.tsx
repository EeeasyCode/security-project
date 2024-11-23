'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../contexts/CartContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '../contexts/AuthContext'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [address, setAddress] = useState('')

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: items,
          total: total,
          address: address
        })
      })

      if (response.ok) {
        alert('주문이 완료되었습니다.')
        clearCart()
        router.push('/')
      } else {
        throw new Error('결제 처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('결제 처리 중 오류가 발생했습니다.')
    }
  }

  if (items.length === 0) {
    return <div className="p-4">장바구니가 비어있습니다.</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">결제</h1>
      <div className="mb-4">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between mb-2">
            <span>{item.product.name} ({item.size}, {item.color}) x {item.quantity}</span>
            <span>${item.product.price * item.quantity}</span>
          </div>
        ))}
        <div className="font-bold mt-2">
          총 금액: ${total}
        </div>
      </div>
      <form onSubmit={handleCheckout}>
        <div className="mb-4">
          <label htmlFor="address" className="block mb-2">배송 주소</label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">결제하기</Button>
      </form>
    </div>
  )
}