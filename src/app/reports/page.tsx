'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Package,
  Users,
  Filter,
  RefreshCw
} from 'lucide-react'
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'

interface ReportData {
  period: string
  totalEntries: number
  totalExits: number
  netChange: number
  totalWeight: number
  averageWeight: number
  totalClients: number
  activeClients: number
  revenue: number
  costs: number
  profit: number
}

interface MovementReport {
  id: string
  date: string
  type: 'entry' | 'exit'
  client: string
  animalType: string
  quantity: number
  weight: number
  value: number
}

interface ClientReport {
  id: string
  name: string
  totalAnimals: number
  totalWeight: number
  totalValue: number
  lastActivity: string
  status: 'active' | 'inactive'
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [movements, setMovements] = useState<MovementReport[]>([])
  const [clientReports, setClientReports] = useState<ClientReport[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('current_month')
  const [selectedReportType, setSelectedReportType] = useState('summary')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [clientFilter, setClientFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    // Mock data - In real app, fetch from API based on filters
    const mockReportData: ReportData = {
      period: 'Agosto 2024',
      totalEntries: 156,
      totalExits: 89,
      netChange: 67,
      totalWeight: 78450,
      averageWeight: 485,
      totalClients: 12,
      activeClients: 9,
      revenue: 245000000, // COP
      costs: 180000000, // COP
      profit: 65000000 // COP
    }

    const mockMovements: MovementReport[] = [
      {
        id: '1',
        date: '2024-08-20',
        type: 'entry',
        client: 'Ganadería El Roble',
        animalType: 'Novillo',
        quantity: 25,
        weight: 12500,
        value: 37500000
      },
      {
        id: '2',
        date: '2024-08-19',
        type: 'exit',
        client: 'Finca La Esperanza',
        animalType: 'Vaca',
        quantity: 15,
        weight: 6750,
        value: 22500000
      },
      {
        id: '3',
        date: '2024-08-18',
        type: 'entry',
        client: 'Hacienda San José',
        animalType: 'Ternero',
        quantity: 30,
        weight: 9000,
        value: 18000000
      },
      {
        id: '4',
        date: '2024-08-17',
        type: 'exit',
        client: 'Ganadería El Roble',
        animalType: 'Toro',
        quantity: 5,
        weight: 3250,
        value: 16250000
      },
      {
        id: '5',
        date: '2024-08-16',
        type: 'entry',
        client: 'Finca La Esperanza',
        animalType: 'Vaca',
        quantity: 20,
        weight: 9400,
        value: 28200000
      }
    ]

    const mockClientReports: ClientReport[] = [
      {
        id: '1',
        name: 'Ganadería El Roble',
        totalAnimals: 73,
        totalWeight: 36560,
        totalValue: 109680000,
        lastActivity: '2024-08-20',
        status: 'active'
      },
      {
        id: '2',
        name: 'Finca La Esperanza',
        totalAnimals: 55,
        totalWeight: 25350,
        totalValue: 76050000,
        lastActivity: '2024-08-19',
        status: 'active'
      },
      {
        id: '3',
        name: 'Hacienda San José',
        totalAnimals: 23,
        totalWeight: 8340,
        totalValue: 25020000,
        lastActivity: '2024-08-18',
        status: 'active'
      }
    ]

    setTimeout(() => {
      setReportData(mockReportData)
      setMovements(mockMovements)
      setClientReports(mockClientReports)
      setLoading(false)
    }, 1000)
  }, [selectedPeriod, dateFrom, dateTo])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getMovementBadge = (type: string) => {
    return type === 'entry' ? (
      <Badge className="bg-green-100 text-green-800">Entrada</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Salida</Badge>
    )
  }

  const filteredMovements = movements.filter(movement => {
    const matchesClient = clientFilter === 'all' || movement.client === clientFilter
    const matchesType = typeFilter === 'all' || movement.type === typeFilter
    return matchesClient && matchesType
  })

  const uniqueClients = Array.from(new Set(movements.map(m => m.client)))

  const handleExportReport = () => {
    // In real app, generate and download report
    console.log('Exporting report...', {
      type: selectedReportType,
      period: selectedPeriod,
      dateFrom,
      dateTo,
      clientFilter,
      typeFilter
    })
  }

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
              <FileText className="h-8 w-8 mr-3 text-blue-600" />
              Reportes y Análisis
            </h1>
            <p className="text-gray-600 mt-2">Análisis detallado de la operación ganadera</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Reporte</Label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Resumen General</SelectItem>
                    <SelectItem value="movements">Movimientos</SelectItem>
                    <SelectItem value="clients">Por Cliente</SelectItem>
                    <SelectItem value="financial">Financiero</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="yesterday">Ayer</SelectItem>
                    <SelectItem value="last_7_days">Últimos 7 días</SelectItem>
                    <SelectItem value="last_30_days">Últimos 30 días</SelectItem>
                    <SelectItem value="current_month">Mes actual</SelectItem>
                    <SelectItem value="last_month">Mes anterior</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedPeriod === 'custom' && (
                <>
                  <div className="space-y-2">
                    <Label>Desde</Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hasta</Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Movimientos Netos
              </CardTitle>
              <Activity className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">+{reportData?.netChange}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {reportData?.totalEntries} entradas, {reportData?.totalExits} salidas
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ingresos
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData?.revenue || 0)}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Período: {reportData?.period}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Peso Total
              </CardTitle>
              <Package className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{reportData?.totalWeight.toLocaleString()} kg</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-yellow-600 flex items-center">
                  Promedio: {reportData?.averageWeight} kg/animal
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ganancia
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportData?.profit || 0)}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-purple-600 flex items-center">
                  Margen: {reportData?.revenue ? ((reportData.profit / reportData.revenue) * 100).toFixed(1) : 0}%
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Movimientos por Tipo
              </CardTitle>
              <CardDescription>Distribución de entradas y salidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Entradas</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(reportData?.totalEntries || 0) / ((reportData?.totalEntries || 0) + (reportData?.totalExits || 0)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{reportData?.totalEntries}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Salidas</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${(reportData?.totalExits || 0) / ((reportData?.totalEntries || 0) + (reportData?.totalExits || 0)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{reportData?.totalExits}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Clientes Activos
              </CardTitle>
              <CardDescription>Estado de la cartera de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Activos</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(reportData?.activeClients || 0) / (reportData?.totalClients || 1) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{reportData?.activeClients}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{reportData?.totalClients}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        {selectedReportType === 'movements' && (
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Movimientos</CardTitle>
              <CardDescription>Detalle de entradas y salidas del período</CardDescription>
              <div className="flex gap-2 mt-4">
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
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="entry">Entradas</SelectItem>
                    <SelectItem value="exit">Salidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Animal</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Peso (kg)</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {format(new Date(movement.date), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>{getMovementBadge(movement.type)}</TableCell>
                      <TableCell className="font-medium">{movement.client}</TableCell>
                      <TableCell>{movement.animalType}</TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>{movement.weight.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(movement.value)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {selectedReportType === 'clients' && (
          <Card>
            <CardHeader>
              <CardTitle>Reporte por Cliente</CardTitle>
              <CardDescription>Resumen de actividad por cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total Animales</TableHead>
                    <TableHead>Peso Total (kg)</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Última Actividad</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientReports.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.totalAnimals}</TableCell>
                      <TableCell>{client.totalWeight.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(client.totalValue)}</TableCell>
                      <TableCell>
                        {format(new Date(client.lastActivity), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Badge className={client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {client.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}