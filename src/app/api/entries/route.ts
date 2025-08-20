import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const entries = await prisma.livestockEntry.findMany({
      include: {
        client: true,
        _count: {
          select: { details: true },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    // Manually calculate total weight for each entry
    const entriesWithWeight = await Promise.all(
      entries.map(async (entry) => {
        const details = await prisma.livestockEntryDetail.findMany({
          where: { entryId: entry.id },
          select: { weight: true },
        })
        const totalWeight = details.reduce((sum, item) => sum + item.weight, 0)
        return {
          ...entry,
          totalWeight,
        }
      })
    )

    return NextResponse.json(entriesWithWeight)
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { entryData, animals } = body

    if (!entryData || !animals || !Array.isArray(animals) || animals.length === 0) {
      return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the master entry record
      const newEntry = await tx.livestockEntry.create({
        data: {
          clientId: entryData.clientId,
          invoiceNumber: entryData.invoiceNumber,
          guideNumber: entryData.guideNumber,
          entryFolio: entryData.entryFolio,
          observations: entryData.observations,
          date: new Date(),
        },
      })

      // 2. Create an Animal and a LivestockEntryDetail for each animal
      for (const animalData of animals) {
        // Create the core animal record
        const newAnimal = await tx.animal.create({
          data: {
            tag: animalData.tag,
            species: animalData.species,
            weight: parseFloat(animalData.weight),
            purchasePrice: parseFloat(animalData.price),
            purchaseDate: newEntry.date,
            status: 'IN_STOCK',
            pen: animalData.pen,
          },
        })

        // Create the entry detail record linking the animal to the entry
        await tx.livestockEntryDetail.create({
          data: {
            entryId: newEntry.id,
            animalId: newAnimal.id,
            weight: parseFloat(animalData.weight),
            price: parseFloat(animalData.price),
          },
        })
      }

      return newEntry
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating entry:', error)
    // Check for unique constraint violation on 'tag'
    if (error.code === 'P2002' && error.meta?.target?.includes('tag')) {
      return NextResponse.json(
        { error: 'One or more animal tags already exist.' },
        { status: 409 } // 409 Conflict
      )
    }
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}
