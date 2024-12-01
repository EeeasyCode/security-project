'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Product = {
  id: number
  name: string
  price: number
  description: string
  category: string
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ name: '', price: 0, description: '', category: '' })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role !== 'admin') {
      // Redirect non-admin users
      window.location.href = '/'
    } else {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    // Implement API call to fetch products
    // For now, we'll use dummy data
    setProducts([
      { id: 1, name: 'T-Shirt', price: 19.99, description: 'Comfortable cotton t-shirt', category: 'Top' },
      { id: 2, name: 'Jeans', price: 49.99, description: 'Classic blue jeans', category: 'Bottom' },
    ])
  }

  const handleAddProduct = async () => {
    // Implement API call to add a new product
    console.log('Adding product:', newProduct)
    // After successful addition, fetch products again
    await fetchProducts()
    setNewProduct({ name: '', price: 0, description: '', category: '' })
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return
    // Implement API call to edit the product
    console.log('Editing product:', editingProduct)
    // After successful edit, fetch products again
    await fetchProducts()
    setEditingProduct(null)
  }

  const handleDeleteProduct = async (id: number) => {
    // Implement API call to delete the product
    console.log('Deleting product with id:', id)
    // After successful deletion, fetch products again
    await fetchProducts()
  }

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">상품 관리</h1>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">새 상품 추가</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 상품 추가</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                가격
              </Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                설명
              </Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                카테고리
              </Label>
              <Select
                value={newProduct.category}
                onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Top">Top</SelectItem>
                  <SelectItem value="Bottom">Bottom</SelectItem>
                  <SelectItem value="Jacket">Jacket</SelectItem>
                  <SelectItem value="ACC">ACC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddProduct}>추가</Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>가격</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead>액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mr-2" onClick={() => setEditingProduct(product)}>
                      수정
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>상품 수정</DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            이름
                          </Label>
                          <Input
                            id="edit-name"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-price" className="text-right">
                            가격
                          </Label>
                          <Input
                            id="edit-price"
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-description" className="text-right">
                            설명
                          </Label>
                          <Textarea
                            id="edit-description"
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-category" className="text-right">
                            카테고리
                          </Label>
                          <Select
                            value={editingProduct.category}
                            onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Top">Top</SelectItem>
                              <SelectItem value="Bottom">Bottom</SelectItem>
                              <SelectItem value="Jacket">Jacket</SelectItem>
                              <SelectItem value="ACC">ACC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    <Button onClick={handleEditProduct}>저장</Button>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>삭제</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}