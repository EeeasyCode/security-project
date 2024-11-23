import { NextResponse } from 'next/server'

// This is a mock database. In a real application, you'd use a proper database.
const reviews = [
  {
    id: '1',
    productId: 1,
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Great product!',
    createdAt: new Date().toISOString()
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  const productReviews = reviews.filter(review => review.productId === Number(productId))
  return NextResponse.json(productReviews)
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.productId || !body.userId || !body.userName || !body.rating || !body.comment) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const newReview = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString()
  }

  reviews.push(newReview)

  return NextResponse.json(newReview, { status: 201 })
}