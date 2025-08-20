'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Package, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  BarChart3
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface InventoryItem {
  id: string
  clientId: string
  clientName: string
  animalType: string
  currentQuantity: number
  totalWeight: number
  averageWeight: number
  entryDate: string
  lastMovement: string
  status: 'active' | 'low_stock' | 'critical'
  location?: string
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor'
  vaccinated: boolean
  nextVaccination?: string
}

interface InventorySummary {
  totalAnimals: number
  totalWeight: number
  averageWeight: number
  byType: Record<string, number>
  byClient: Record<string, number>
  healthDistribution: Record<string, number>
  vaccinationPending: number
}

export default function LivestockInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [summary, setSummary] = useState<InventorySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [clientFilter, setClientFilter] = useState<string>('all')

  useEffect(() => {
    // Mock data - In real app, fetch from API
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Ganadería El Roble',
        animalType: 'Novillo',
        currentQuantity: 45,
        totalWeight: 23400,
        averageWeight: 520,
        entryDate: '2024-07-15',
        lastMovement: '2024-08-10',
        status: 'active',
        location: 'Potrero A',
        healthStatus: 'excellent',
        vaccinated: true,
        nextVaccination: '2024-09-15'
      },
      {
        id: '2',
        clientId: '1',
        clientName: 'Ganadería El Roble',
        animalType: 'Vaca',
        currentQuantity: 28,
        totalWeight: 13160,
        averageWeight: 470,
        entryDate: '2024-06-20',
        lastMovement: '2024-08-05',
        status: 'active',
        location: 'Potrero B',
        healthStatus: 'good',
        vaccinated: true,
        nextVaccination: '2024-08-25'
      },
      {
        id: '3',
        clientId: '2',
        clientName: 'Finca La Esperanza',
        animalType: 'Toro',
        currentQuantity: 3,
        totalWeight: 1950,
        averageWeight: 650,
        entryDate: '2024-08-01',
        lastMovement: '2024-08-19',
        status: 'low_stock',
        location: 'Potrero C',
        healthStatus: 'excellent',
        vaccinated: false,
        nextVaccination: '2024-08-30'
      },
      {
        id: '4',
        clientId: '2',
        clientName: 'Finca La Esperanza',
        animalType: 'Vaca',
        currentQuantity: 52,
        totalWeight: 23400,
        averageWeight: 450,
        entryDate: '2024-07-10',
        lastMovement: '2024-08-18',
        status: 'active',
        location: 'Potrero D',
        healthStatus: 'good',
        vaccinated: true,
        nextVaccination: '2024-09-10'
      },
      {
        id: '5',
        clientId: '3',
        clientName: 'Hacienda San José',
        animalType: 'Ternero',
        currentQuantity: 15,
        totalWeight: 4500,
        averageWeight: 300,
        entryDate: '2024-08-05',
        lastMovement: '2024-08-20',
        status: 'active',
        location: 'Potrero E',
        healthStatus: 'fair',
        vaccinated: false,
        nextVaccination: '2024-08-25'
      },
      {
        id: '6',
        clientId: '3',
        clientName: 'Hacienda San José',
        animalType: 'Novillo',
        currentQuantity: 8,
        totalWeight: 3840,
        averageWeight: 480,
        entryDate: '2024-08-12',
        lastMovement: '2024-08-18',
        status: 'low_stock',
        location: 'Potrero F',
        healthStatus: 'good',
        vaccinated: true,
        nextVaccination: '2024-09-12'
      }
    ]

    // Calculate summary
    const mockSummary: InventorySummary = {
      totalAnimals: mockInventory.reduce((sum, item) => sum + item.currentQuantity, 0),
      totalWeight: mockInventory.reduce((sum, item) => sum + item.totalWeight, 0),
      averageWeight: 0,
      byType: {},
      byClient: {},
      healthDistribution: {},
      vaccinationPending: mockInventory.filter(item => !item.vaccinated).length
    }

    mockSummary.averageWeight = Math.round(mockSummary.totalWeight / mockSummary.totalAnimals)

    // Group by type
    mockInventory.forEach(item => {
      mockSummary.byType[item.animalType] = (mockSummary.byType[item.animalType] || 0) + item.currentQuantity
      mockSummary.byClient[item.clientName] = (mockSummary.byClient[item.clientName] || 0) + item.currentQuantity
      mockSummary.healthDistribution[item.healthStatus] = (mockSummary.healthDistribution[item.healthStatus] || 0) + item.currentQuantity
    })

    setTimeout(() => {
      setInventory(mockInventory)
      setSummary(mockSummary)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.animalType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || item.animalType === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesClient = clientFilter === 'all' || item.clientName === clientFilter
    return matchesSearch && matchesType && matchesStatus && matchesClient
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case 'low_stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Stock Bajo</Badge>
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Crítico</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excelente</Badge>
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Bueno</Badge>
      case 'fair':
        return <Badge className="bg-yellow-100 text-yellow-800">Regular</Badge>
      case 'poor':
        return <Badge className="bg-red-100 text-red-800">Malo</Badge>
      default:
        return <Badge variant="secondary">{health}</Badge>
    }
  }

  const uniqueClients = Array.from(new Set(inventory.map(item => item.clientName)))
  const uniqueTypes = Array.from(new Set(inventory.map(item => item.animalType)))

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="h-8 w-8 mr-3 text-blue-600" />
              Inventario de Ganado
            </h1>
            <p className="text-gray-600 mt-2">Control y seguimiento del ganado en el sistema</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reportes
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Animales
              </CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{summary?.totalAnimals.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-blue-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  En inventario activo
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Peso Total
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{summary?.totalWeight.toLocaleString()} kg</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-600 flex items-center">
                  Peso promedio: {summary?.averageWeight} kg
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Vacunación Pendiente
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{summary?.vaccinationPending}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-yellow-600 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requieren atención
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tipos de Ganado
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{Object.keys(summary?.byType || {}).length}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-purple-600 flex items-center">
                  Categorías diferentes
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Tipo</CardTitle>
              <CardDescription>Cantidad de animales por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(summary?.byType || {}).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / (summary?.totalAnimals || 1)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Salud</CardTitle>
              <CardDescription>Distribución del estado sanitario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(summary?.healthDistribution || {}).map(([health, count]) => (
                  <div key={health} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{health === 'excellent' ? 'Excelente' : health === 'good' ? 'Bueno' : health === 'fair' ? 'Regular' : 'Malo'}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            health === 'excellent' ? 'bg-green-600' :
                            health === 'good' ? 'bg-blue-600' :
                            health === 'fair' ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${(count / (summary?.totalAnimals || 1)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente o tipo de animal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {uniqueClients.map(client => (
                      <SelectItem key={client} value={client}>{client}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="low_stock">Stock Bajo</SelectItem>
                    <SelectItem value="critical">Críticos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventario Detallado</CardTitle>
            <CardDescription>Lista completa del ganado en inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Peso Total (kg)</TableHead>
                  <TableHead>Peso Promedio (kg)</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado Salud</TableHead>
                  <TableHead>Vacunado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.clientName}</TableCell>
                    <TableCell>{item.animalType}</TableCell>
                    <TableCell>{item.currentQuantity}</TableCell>
                    <TableCell>{item.totalWeight.toLocaleString()}</TableCell>
                    <TableCell>{item.averageWeight}</TableCell>
                    <TableCell>{item.location || 'No asignada'}</TableCell>
                    <TableCell>{getHealthBadge(item.healthStatus)}</TableCell>
                    <TableCell>
                      {item.vaccinated ? (
                        <Badge className="bg-green-100 text-green-800">Sí</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}