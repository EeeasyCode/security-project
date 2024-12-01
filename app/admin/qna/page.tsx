'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from 'next/navigation'

type QnA = {
  id: number
  userId: number
  userName: string
  question: string
  answer: string | null
  createdAt: string
}

export default function AdminQnA() {
  const [qnas, setQnAs] = useState<QnA[]>([])
  const [selectedQnA, setSelectedQnA] = useState<QnA | null>(null)
  const [answer, setAnswer] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
    } else {
      fetchQnAs()
    }
  }, [user, router])

  const fetchQnAs = async () => {
    // 실제 API 호출로 대체해야 합니다
    const response = await fetch('/api/admin/qna')
    const data = await response.json()
    setQnAs(data)
  }

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQnA) return

    // 실제 API 호출로 대체해야 합니다
    await fetch(`/api/admin/qna/${selectedQnA.id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    })

    setAnswer('')
    setSelectedQnA(null)
    fetchQnAs()
  }

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">QnA 관리</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>고객명</TableHead>
            <TableHead>질문</TableHead>
            <TableHead>답변 상태</TableHead>
            <TableHead>작성일</TableHead>
            <TableHead>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qnas.map((qna) => (
            <TableRow key={qna.id}>
              <TableCell>{qna.id}</TableCell>
              <TableCell>{qna.userName}</TableCell>
              <TableCell>{qna.question.substring(0, 30)}...</TableCell>
              <TableCell>{qna.answer ? '답변 완료' : '답변 대기'}</TableCell>
              <TableCell>{new Date(qna.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button onClick={() => setSelectedQnA(qna)} disabled={!!qna.answer}>
                  답변하기
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedQnA && (
        <form onSubmit={handleAnswer} className="mt-6">
          <h2 className="text-xl font-semibold mb-2">답변 작성</h2>
          <p className="mb-2"><strong>질문:</strong> {selectedQnA.question}</p>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="답변을 입력하세요..."
            className="mb-4"
            required
          />
          <Button type="submit">답변 제출</Button>
        </form>
      )}
    </div>
  )
}