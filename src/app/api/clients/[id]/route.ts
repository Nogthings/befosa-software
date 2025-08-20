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
    const client = await prisma.client.findUnique({
      where: { id: params.id },
    })
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }
    return NextResponse.json(client)
  } catch (error) {
    console.error(`Error fetching client ${params.id}:`, error)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: Params) {
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

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: { name, phone, city, rfc, curp, address },
    })
    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error(`Error updating client ${params.id}:`, error)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.client.delete({
      where: { id: params.id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(`Error deleting client ${params.id}:`, error)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}
