'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Product = {
    id: number;
    image: string;
    name: string;
    price: number;
    description: string;
    category: "Top" | "Bottom" | "Jacket" | "ACC";
    sizes: string[];
    colors: string[];
  };
  
type CartItem = {
  product: Product
  quantity: number
  size?: string
  color?: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void
  removeFromCart: (item: CartItem) => void
  updateQuantity: (item: CartItem, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
    
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setItems(prev => {
      const existingItem = prev.find(
        item => item.product.id === product.id && item.size === size && item.color === color
      )

      if (existingItem) {
        return prev.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prev, { product, quantity, size, color }]
    })
  }

  const removeFromCart = (item: CartItem) => {
    setItems(prev => prev.filter(i => 
      !(i.product.id === item.product.id && i.size === item.size && i.color === item.color)
    ))
  }

  const updateQuantity = (item: CartItem, quantity: number) => {
    setItems(prev =>
      prev.map(i =>
        (i.product.id === item.product.id && i.size === item.size && i.color === item.color)
          ? { ...i, quantity: Math.max(0, quantity) }
          : i
      ).filter(i => i.quantity > 0)
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}