'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Beef,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  AlertTriangle
} from 'lucide-react'

interface DashboardStats {
  totalCattle: number
  totalEntries: number
  totalExits: number
  totalClients: number
  monthlyRevenue: number
  averageWeight: number
  recentEntries: Array<{
    id: string
    clientName: string
    quantity: number
    date: string
    type: string
  }>
  recentExits: Array<{
    id: string
    clientName: string
    quantity: number
    date: string
    type: string
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call - In real app, this would fetch from your API
    const fetchStats = async () => {
      // Mock data for demonstration
      const mockStats: DashboardStats = {
        totalCattle: 1247,
        totalEntries: 156,
        totalExits: 89,
        totalClients: 23,
        monthlyRevenue: 2450000,
        averageWeight: 485,
        recentEntries: [
          {
            id: '1',
            clientName: 'Ganadería El Roble',
            quantity: 25,
            date: '2024-08-20',
            type: 'Novillo'
          },
          {
            id: '2',
            clientName: 'Finca La Esperanza',
            quantity: 18,
            date: '2024-08-19',
            type: 'Vaca'
          },
          {
            id: '3',
            clientName: 'Hacienda San José',
            quantity: 32,
            date: '2024-08-18',
            type: 'Toro'
          }
        ],
        recentExits: [
          {
            id: '1',
            clientName: 'Ganadería El Roble',
            quantity: 15,
            date: '2024-08-20',
            type: 'Novillo'
          },
          {
            id: '2',
            clientName: 'Finca La Esperanza',
            quantity: 12,
            date: '2024-08-19',
            type: 'Vaca'
          }
        ]
      }
      
      setTimeout(() => {
        setStats(mockStats)
        setLoading(false)
      }, 1000)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Vista general del sistema de gestión ganadera</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Ganado
              </CardTitle>
              <Beef className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalCattle.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% desde el mes pasado
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Entradas del Mes
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalEntries}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-blue-600 flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  +8% vs mes anterior
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Salidas del Mes
              </CardTitle>
              <TrendingDown className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalExits}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-orange-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -3% vs mes anterior
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Clientes Activos
              </CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalClients}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-purple-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2 nuevos este mes
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Ingresos del Mes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${stats?.monthlyRevenue.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 mt-1">COP</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Peso Promedio</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats?.averageWeight} kg
              </div>
              <p className="text-sm text-gray-500 mt-1">Por cabeza</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>Alertas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vacunación pendiente</span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    3
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revisión veterinaria</span>
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    1
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Entradas Recientes</span>
              </CardTitle>
              <CardDescription>Últimas entradas de ganado registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{entry.clientName}</p>
                      <p className="text-sm text-gray-600">{entry.quantity} {entry.type}s</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{entry.date}</p>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Entrada
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                <span>Salidas Recientes</span>
              </CardTitle>
              <CardDescription>Últimas salidas de ganado registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentExits.map((exit) => (
                  <div key={exit.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{exit.clientName}</p>
                      <p className="text-sm text-gray-600">{exit.quantity} {exit.type}s</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{exit.date}</p>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Salida
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}