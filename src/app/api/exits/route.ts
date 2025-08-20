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
    const exits = await prisma.livestockExit.findMany({
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

    // This is a simplified GET. A real implementation might need to calculate total weight/profit here.
    return NextResponse.json(exits)
  } catch (error) {
    console.error('Error fetching exits:', error)
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
    const { exitData, animals } = body // `animals` here are animals to be sold

    if (!exitData || !animals || !Array.isArray(animals) || animals.length === 0) {
      return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the master exit record
      const newExit = await tx.livestockExit.create({
        data: {
          clientId: exitData.clientId,
          invoiceNumber: exitData.invoiceNumber,
          guideNumber: exitData.guideNumber,
          exitFolio: exitData.exitFolio,
          observations: exitData.observations,
          date: new Date(),
        },
      })

      let totalProfit = 0

      // 2. Process each animal being sold
      for (const animalSaleData of animals) {
        const animal = await tx.animal.findUnique({
          where: { id: animalSaleData.id },
        })

        if (!animal) {
          throw new Error(`Animal with ID ${animalSaleData.id} not found.`)
        }
        if (animal.status !== 'IN_STOCK') {
          throw new Error(`Animal with tag ${animal.tag} is not in stock.`)
        }

        // Update animal status
        await tx.animal.update({
          where: { id: animal.id },
          data: { status: 'SOLD' },
        })

        // Calculate profit
        const salePrice = parseFloat(animalSaleData.salePrice)
        const profit = salePrice - animal.purchasePrice
        totalProfit += profit

        // Create exit detail record
        await tx.livestockExitDetail.create({
          data: {
            exitId: newExit.id,
            animalId: animal.id,
            weight: animal.weight, // or use a new sale weight if provided
            price: salePrice,
            profit: profit,
          },
        })
      }

      // 3. Update the total profit on the exit record
      const finalExit = await tx.livestockExit.update({
          where: { id: newExit.id },
          data: { totalProfit: totalProfit }
      })

      return finalExit
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating exit:', error)
    return NextResponse.json({ error: error.message || 'An error occurred.' }, { status: 500 })
  }
}
