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
import { Plus, Search, Filter, Download, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Client {
  id: string
  name: string
  email: string
}

interface LivestockEntry {
  id: string
  clientId: string
  clientName: string
  entryDate: string
  totalAnimals: number
  totalWeight: number
  averageWeight: number
  status: 'active' | 'completed'
  details: Array<{
    id: string
    animalType: string
    quantity: number
    averageWeight: number
    observations?: string
  }>
}

export default function LivestockEntriesPage() {
  const [entries, setEntries] = useState<LivestockEntry[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Form state
  const [formData, setFormData] = useState({
    clientId: '',
    entryDate: new Date().toISOString().split('T')[0],
    details: [
      {
        animalType: '',
        quantity: 0,
        averageWeight: 0,
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

    const mockEntries: LivestockEntry[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Ganadería El Roble',
        entryDate: '2024-08-20',
        totalAnimals: 25,
        totalWeight: 12500,
        averageWeight: 500,
        status: 'active',
        details: [
          {
            id: '1',
            animalType: 'Novillo',
            quantity: 15,
            averageWeight: 520,
            observations: 'Excelente condición'
          },
          {
            id: '2',
            animalType: 'Vaca',
            quantity: 10,
            averageWeight: 470,
            observations: 'Buena condición general'
          }
        ]
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'Finca La Esperanza',
        entryDate: '2024-08-19',
        totalAnimals: 18,
        totalWeight: 8640,
        averageWeight: 480,
        status: 'active',
        details: [
          {
            id: '3',
            animalType: 'Toro',
            quantity: 3,
            averageWeight: 650,
            observations: 'Reproductores de alta calidad'
          },
          {
            id: '4',
            animalType: 'Vaca',
            quantity: 15,
            averageWeight: 450,
            observations: 'Listas para reproducción'
          }
        ]
      },
      {
        id: '3',
        clientId: '3',
        clientName: 'Hacienda San José',
        entryDate: '2024-08-18',
        totalAnimals: 32,
        totalWeight: 15360,
        averageWeight: 480,
        status: 'completed',
        details: [
          {
            id: '5',
            animalType: 'Novillo',
            quantity: 20,
            averageWeight: 490,
            observations: 'Ganado joven para engorde'
          },
          {
            id: '6',
            animalType: 'Vaca',
            quantity: 12,
            averageWeight: 460,
            observations: 'Vacas de descarte'
          }
        ]
      }
    ]

    setTimeout(() => {
      setClients(mockClients)
      setEntries(mockEntries)
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
    console.log('Submitting entry:', formData)
    setShowForm(false)
    // Reset form
    setFormData({
      clientId: '',
      entryDate: new Date().toISOString().split('T')[0],
      details: [{
        animalType: '',
        quantity: 0,
        averageWeight: 0,
        observations: ''
      }]
    })
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
            <h1 className="text-3xl font-bold text-gray-900">Entradas de Ganado</h1>
            <p className="text-gray-600 mt-2">Gestión de ingresos de ganado al sistema</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Entrada
          </Button>
        </div>

        {/* New Entry Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nueva Entrada</CardTitle>
              <CardDescription>Complete la información del ganado que ingresa</CardDescription>
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
                    <Label htmlFor="entryDate">Fecha de Entrada</Label>
                    <Input
                      id="entryDate"
                      type="date"
                      value={formData.entryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
                      required
                    />
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
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
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
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Registrar Entrada
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
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="completed">Completados</SelectItem>
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

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Entradas Registradas</CardTitle>
            <CardDescription>Lista de todas las entradas de ganado</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total Animales</TableHead>
                  <TableHead>Peso Total (kg)</TableHead>
                  <TableHead>Peso Promedio (kg)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.clientName}</TableCell>
                    <TableCell>
                      {format(new Date(entry.entryDate), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>{entry.totalAnimals}</TableCell>
                    <TableCell>{entry.totalWeight.toLocaleString()}</TableCell>
                    <TableCell>{entry.averageWeight}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={entry.status === 'active' ? 'default' : 'secondary'}
                        className={entry.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {entry.status === 'active' ? 'Activo' : 'Completado'}
                      </Badge>
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