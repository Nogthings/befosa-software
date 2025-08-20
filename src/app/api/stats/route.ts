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
    // 1. Inventory Value and Head Count
    const inventoryStats = await prisma.animal.aggregate({
      _sum: {
        purchasePrice: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: 'IN_STOCK',
      },
    })

    // 2. Total Profit
    const profitStats = await prisma.livestockExit.aggregate({
      _sum: {
        totalProfit: true,
      },
    })

    // 3. Total Clients
    const clientCount = await prisma.client.count()

    // 4. Chart Data (Simplified)
    // For a real app, this would involve more complex queries, maybe grouping by month/week.
    // Here we'll just return some static placeholder data for the chart.
    const chartData = {
        estimated: [
            { month: 'Sep', value: 30 }, { month: 'Oct', value: 20 }, { month: 'Nov', value: 25 },
            { month: 'Dic', value: 40 }, { month: 'Ene', value: 35 }, { month: 'Feb', value: 50 },
            { month: 'Mar', value: 45 }, { month: 'Abr', value: 55 }, { month: 'May', value: 50 },
            { month: 'Jun', value: 60 }, { month: 'Jul', value: 58 }, { month: 'Ago', value: 62 },
        ],
        achieved: [
            { month: 'Sep', value: 25 }, { month: 'Oct', value: 15 }, { month: 'Nov', value: 22 },
            { month: 'Dic', value: 30 }, { month: 'Ene', value: 28 }, { month: 'Feb', value: 45 },
            { month: 'Mar', value: 38 }, { month: 'Abr', value: 52 }, { month: 'May', value: 48 },
            { month: 'Jun', value: 55 }, { month: 'Jul', value: 50 }, { month: 'Ago', value: 58 },
        ]
    }
    const weeklySalesData = [
        { day: 'L', sales: 40, goal: 60 }, { day: 'M', sales: 30, goal: 50 },
        { day: 'M', sales: 65, goal: 70 }, { day: 'J', sales: 95, goal: 90 },
        { day: 'V', sales: 35, goal: 40 }, { day: 'S', sales: 25, goal: 30 },
        { day: 'D', sales: 50, goal: 60 },
    ]


    const stats = {
      inventoryValue: inventoryStats._sum.purchasePrice ?? 0,
      headCount: inventoryStats._count.id ?? 0,
      totalProfit: profitStats._sum.totalProfit ?? 0,
      clientCount: clientCount,
      chartData: chartData,
      weeklySalesData: weeklySalesData
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}
