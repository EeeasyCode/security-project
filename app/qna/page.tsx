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
  fileName: string | null
}

export default function UserQnA() {
  const [qnas, setQnAs] = useState<QnA[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const fetchQnAs = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/qna/user/${user?.id}`)
    const data = await response.json()
    console.log(data)
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

    if (!file) {
      alert('파일을 선택해 주세요.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user.id.toString())
    formData.append('question', newQuestion)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/qna`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error:', errorData)
        alert('질문 등록에 실패했습니다.')
        return
      }

      setNewQuestion('')
      setFile(null)
      fetchQnAs()
    } catch (error) {
      console.error('질문 등록 오류:', error)
      alert('질문 등록에 실패했습니다.')
    }
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
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
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
            <TableHead>파일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qnas.map((qna) => (
            <TableRow key={qna.id}>
              <TableCell>{qna.question}</TableCell>
              <TableCell>{qna.answer || '답변 대기 중'}</TableCell>
              <TableCell>{new Date(qna.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {qna.fileName && (
                  <a href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${qna.fileName}`} target="_blank" rel="noopener noreferrer">
                    파일 다운로드
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}