import { NextResponse } from 'next/server'

// 이것은 모의 데이터베이스입니다. 실제 애플리케이션에서는 적절한 데이터베이스를 사용해야 합니다.
const purchases = [
  { id: '1', userId: 'user1', productId: 1, createdAt: new Date().toISOString() },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const productId = searchParams.get('productId')

  if (!userId || !productId) {
    return NextResponse.json({ error: '사용자 ID와 상품 ID가 필요합니다.' }, { status: 400 })
  }

  const hasPurchased = purchases.some(
    purchase => purchase.userId === userId && purchase.productId === Number(productId)
  )

  return NextResponse.json({ hasPurchased })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.userId || !body.items || !body.total || !body.address) {
    return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 })
  }

  const newPurchase = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString()
  }

  // 실제 애플리케이션에서는 여기에 결제 처리 로직을 추가해야 합니다.

  purchases.push(...body.items.map((item: any) => ({
    id: Date.now().toString(),
    userId: body.userId,
    productId: item.product.id,
    createdAt: new Date().toISOString()
  })))

  return NextResponse.json(newPurchase, { status: 201 })
}