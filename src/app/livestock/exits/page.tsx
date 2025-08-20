'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Plus, Search, Filter, Download, Eye, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Client {
  id: string
  name: string
  email: string
}

interface LivestockExit {
  id: string
  clientId: string
  clientName: string
  exitDate: string
  totalAnimals: number
  totalWeight: number
  averageWeight: number
  destination: string
  reason: string
  status: 'pending' | 'completed' | 'cancelled'
  details: Array<{
    id: string
    animalType: string
    quantity: number
    averageWeight: number
    pricePerKg?: number
    totalValue?: number
    observations?: string
  }>
}

export default function LivestockExitsPage() {
  const [exits, setExits] = useState<LivestockExit[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    exitDate: new Date().toISOString().split('T')[0],
    destination: '',
    reason: '',
    details: [
      {
        animalType: '',
        quantity: 0,
        averageWeight: 0,
        pricePerKg: 0,
        observations: ''
      }
    ]
  })

  useEffect(() => {
    // Mock data - In real app, fetch from API
    const mockClients: Client[] = [
      { id: '1', name: 'Ganadería El Roble', email: 'contacto@elroble.com' },
      { id: '2', name: 'Finca La Esperanza', email: 'info@laesperanza.com' },
      { id: '3', name: 'Hacienda San José', email: 'admin@sanjose.com' }
    ]

    const mockExits: LivestockExit[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Ganadería El Roble',
        exitDate: '2024-08-20',
        totalAnimals: 15,
        totalWeight: 7500,
        averageWeight: 500,
        destination: 'Frigorífico Central',
        reason: 'Venta',
        status: 'completed',
        details: [
          {
            id: '1',
            animalType: 'Novillo',
            quantity: 10,
            averageWeight: 520,
            pricePerKg: 8500,
            totalValue: 44200000,
            observations: 'Ganado de primera calidad'
          },
          {
            id: '2',
            animalType: 'Vaca',
            quantity: 5,
            averageWeight: 460,
            pricePerKg: 7800,
            totalValue: 17940000,
            observations: 'Vacas de descarte'
          }
        ]
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'Finca La Esperanza',
        exitDate: '2024-08-19',
        totalAnimals: 12,
        totalWeight: 5760,
        averageWeight: 480,
        destination: 'Subasta Ganadera',
        reason: 'Venta',
        status: 'pending',
        details: [
          {
            id: '3',
            animalType: 'Vaca',
            quantity: 12,
            averageWeight: 480,
            pricePerKg: 7500,
            totalValue: 43200000,
            observations: 'Lote homogéneo'
          }
        ]
      },
      {
        id: '3',
        clientId: '3',
        clientName: 'Hacienda San José',
        exitDate: '2024-08-18',
        totalAnimals: 8,
        totalWeight: 3840,
        averageWeight: 480,
        destination: 'Otra Finca',
        reason: 'Traslado',
        status: 'completed',
        details: [
          {
            id: '4',
            animalType: 'Toro',
            quantity: 2,
            averageWeight: 650,
            observations: 'Reproductores'
          },
          {
            id: '5',
            animalType: 'Vaca',
            quantity: 6,
            averageWeight: 415,
            observations: 'Traslado para reproducción'
          }
        ]
      }
    ]

    setTimeout(() => {
      setClients(mockClients)
      setExits(mockExits)
      setLoading(false)
    }, 1000)
  }, [])

  const addDetailRow = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, {
        animalType: '',
        quantity: 0,
        averageWeight: 0,
        pricePerKg: 0,
        observations: ''
      }]
    }))
  }

  const removeDetailRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }))
  }

  const updateDetail = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
      )
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, submit to API
    console.log('Submitting exit:', formData)
    setShowForm(false)
    // Reset form
    setFormData({
      clientId: '',
      exitDate: new Date().toISOString().split('T')[0],
      destination: '',
      reason: '',
      details: [{
        animalType: '',
        quantity: 0,
        averageWeight: 0,
        pricePerKg: 0,
        observations: ''
      }]
    })
  }

  const filteredExits = exits.filter(exit => {
    const matchesSearch = exit.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || exit.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
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
              <TrendingDown className="h-8 w-8 mr-3 text-orange-600" />
              Salidas de Ganado
            </h1>
            <p className="text-gray-600 mt-2">Gestión de salidas y ventas de ganado</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Salida
          </Button>
        </div>

        {/* New Exit Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nueva Salida</CardTitle>
              <CardDescription>Complete la información del ganado que sale del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Select value={formData.clientId} onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exitDate">Fecha de Salida</Label>
                    <Input
                      id="exitDate"
                      type="date"
                      value={formData.exitDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, exitDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destino</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="Ej: Frigorífico Central, Subasta, Otra Finca"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo</Label>
                    <Select value={formData.reason} onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Venta">Venta</SelectItem>
                        <SelectItem value="Traslado">Traslado</SelectItem>
                        <SelectItem value="Sacrificio">Sacrificio</SelectItem>
                        <SelectItem value="Muerte">Muerte</SelectItem>
                        <SelectItem value="Robo">Robo</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Detalles del Ganado</h3>
                    <Button type="button" onClick={addDetailRow} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Tipo
                    </Button>
                  </div>

                  {formData.details.map((detail, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Tipo de Animal</Label>
                        <Select value={detail.animalType} onValueChange={(value) => updateDetail(index, 'animalType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Toro">Toro</SelectItem>
                            <SelectItem value="Vaca">Vaca</SelectItem>
                            <SelectItem value="Novillo">Novillo</SelectItem>
                            <SelectItem value="Ternero">Ternero</SelectItem>
                            <SelectItem value="Ternera">Ternera</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          min="1"
                          value={detail.quantity}
                          onChange={(e) => updateDetail(index, 'quantity', parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Peso Promedio (kg)</Label>
                        <Input
                          type="number"
                          min="1"
                          value={detail.averageWeight}
                          onChange={(e) => updateDetail(index, 'averageWeight', parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Precio por Kg (COP)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={detail.pricePerKg}
                          onChange={(e) => updateDetail(index, 'pricePerKg', parseInt(e.target.value) || 0)}
                          placeholder="Opcional"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Observaciones</Label>
                        <Input
                          value={detail.observations}
                          onChange={(e) => updateDetail(index, 'observations', e.target.value)}
                          placeholder="Opcional"
                        />
                      </div>
                      <div className="flex items-end">
                        {formData.details.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeDetailRow(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" onClick={() => setShowForm(false)} variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                    Registrar Salida
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="completed">Completados</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exits Table */}
        <Card>
          <CardHeader>
            <CardTitle>Salidas Registradas</CardTitle>
            <CardDescription>Lista de todas las salidas de ganado</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total Animales</TableHead>
                  <TableHead>Peso Total (kg)</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExits.map((exit) => (
                  <TableRow key={exit.id}>
                    <TableCell className="font-medium">{exit.clientName}</TableCell>
                    <TableCell>
                      {format(new Date(exit.exitDate), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>{exit.totalAnimals}</TableCell>
                    <TableCell>{exit.totalWeight.toLocaleString()}</TableCell>
                    <TableCell>{exit.destination}</TableCell>
                    <TableCell>{exit.reason}</TableCell>
                    <TableCell>
                      {getStatusBadge(exit.status)}
                    </TableCell>
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