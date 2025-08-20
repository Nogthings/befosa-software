import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const inStockAnimals = await prisma.animal.findMany({
      where: {
        status: 'IN_STOCK',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(inStockAnimals)
  } catch (error) {
    console.error('Error fetching in-stock animals:', error)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}
