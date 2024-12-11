'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  })

  if (!user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user[0].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          currentPassword: formData.password,
          newPassword: formData.newPassword || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUserData = await response.json()
      updateUser(updatedUserData)

      alert('프로필이 성공적으로 업데이트되었습니다.')
      router.push('/mypage')
    } catch (error) {
      alert('프로필 업데이트에 실패했습니다.')
      console.error('Profile update error:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>프로필 수정</CardTitle>
          <CardDescription>회원 정보를 수정할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                이름
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                이메일
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                주소
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">비밀번호 변경</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    현재 비밀번호
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                    새 비밀번호
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    새 비밀번호 확인
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                취소
              </Button>
              <Button type="submit">
                저장
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}