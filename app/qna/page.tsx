'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from 'next/navigation'

type QnA = {
  id: number
  question: string
  answer: string | null
  createdAt: string
}

export default function UserQnA() {
  const [qnas, setQnAs] = useState<QnA[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  const fetchQnAs = useCallback(async () => {
    // 실제 API 호출로 대체해야 합니다
    const response = await fetch(`/api/qna/user/${user?.id}`)
    const data = await response.json()
    setQnAs(data)
  }, [user?.id])

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      fetchQnAs()
    }
  }, [user, router, fetchQnAs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // 실제 API 호출로 대체해야 합니다
    await fetch('/api/qna', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, question: newQuestion })
    })

    setNewQuestion('')
    fetchQnAs()
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">QnA</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="질문을 입력하세요..."
          className="mb-4"
          required
        />
        <Button type="submit">질문 등록</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>질문</TableHead>
            <TableHead>답변</TableHead>
            <TableHead>작성일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qnas.map((qna) => (
            <TableRow key={qna.id}>
              <TableCell>{qna.question}</TableCell>
              <TableCell>{qna.answer || '답변 대기 중'}</TableCell>
              <TableCell>{new Date(qna.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}