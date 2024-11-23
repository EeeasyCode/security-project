'use client'

import { useCart } from '../contexts/CartContext'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (items.length === 0) {
    return <div className="p-4">장바구니가 비어있습니다.</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      {items.map((item) => (
        <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between items-center mb-4 p-4 border rounded">
          <div>
            <h2 className="font-bold">{item.product.name}</h2>
            <p>사이즈: {item.size}, 색상: {item.color}</p>
            <p>가격: ${item.product.price}</p>
          </div>
          <div className="flex items-center">
            <Button onClick={() => updateQuantity(item, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
            <span className="mx-2">{item.quantity}</span>
            <Button onClick={() => updateQuantity(item, item.quantity + 1)}>+</Button>
            <Button onClick={() => removeFromCart(item)} className="ml-4" variant="destructive">삭제</Button>
          </div>
        </div>
      ))}
      <div className="mt-4 text-right">
        <p className="text-xl font-bold">총 금액: ${total}</p>
        <Button onClick={handleCheckout} className="mt-2">결제하기</Button>
      </div>
    </div>
  )
}