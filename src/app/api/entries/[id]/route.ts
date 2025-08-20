import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

interface Params {
  params: { id: string }
}

export async function GET(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const entry = await prisma.livestockEntry.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        details: {
          include: {
            animal: true,
          },
        },
      },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error(`Error fetching entry ${params.id}:`, error)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}
