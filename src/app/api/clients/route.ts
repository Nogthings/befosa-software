import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching clients.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, phone, city, rfc, curp, address } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        phone,
        city,
        rfc,
        curp,
        address,
      },
    })
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the client.' },
      { status: 500 }
    )
  }
}
