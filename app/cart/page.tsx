'use client'

import { Minus, Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useCart } from '../contexts/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some items to your cart to continue shopping</p>
        <Button onClick={() => router.push('/')}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.product.id}-${item.size}-${item.color}`}
            className="flex items-center gap-4 p-4 bg-white rounded-lg border"
          >
            <div className="w-24 h-24 relative flex-shrink-0">
              <Image
                src="/placeholder.svg"
                alt={item.product.name}
                fill
                className="object-cover rounded"
              />
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    <Link href={`/products/${item.product.id}`} className="hover:underline">
                      {item.product.name}
                    </Link>
                  </h3>
                  {item.size && (
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                  )}
                  {item.color && (
                    <p className="text-sm text-gray-600">Color: {item.color}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-medium">${item.product.price * item.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 border-t pt-8">
        <div className="flex justify-between items-center mb-8">
          <span className="text-lg font-medium">Total</span>
          <span className="text-2xl font-bold">${total}</span>
        </div>
        
        <Button className="w-full" size="lg">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  )
}