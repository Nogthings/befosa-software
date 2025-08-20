'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Building,
  Calendar,
  TrendingUp,
  Package
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  contactPerson: string
  businessType: 'individual' | 'company' | 'cooperative'
  taxId: string
  registrationDate: string
  status: 'active' | 'inactive' | 'suspended'
  totalAnimals: number
  totalWeight: number
  lastActivity: string
  notes?: string
}

interface ClientFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  contactPerson: string
  businessType: 'individual' | 'company' | 'cooperative'
  taxId: string
  notes: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactPerson: '',
    businessType: 'individual',
    taxId: '',
    notes: ''
  })

  useEffect(() => {
    // Mock data - In real app, fetch from API
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'Ganadería El Roble',
        email: 'contacto@ganaderiaelroble.com',
        phone: '+57 300 123 4567',
        address: 'Finca El Roble, Vereda La Esperanza',
        city: 'Montería',
        state: 'Córdoba',
        zipCode: '230001',
        contactPerson: 'Carlos Rodríguez',
        businessType: 'company',
        taxId: '900123456-1',
        registrationDate: '2024-01-15',
        status: 'active',
        totalAnimals: 73,
        totalWeight: 36560,
        lastActivity: '2024-08-20',
        notes: 'Cliente preferencial con más de 10 años de experiencia'
      },
      {
        id: '2',
        name: 'Finca La Esperanza',
        email: 'info@fincalaesperanza.co',
        phone: '+57 310 987 6543',
        address: 'Km 25 Vía Sincelejo - Corozal',
        city: 'Sincelejo',
        state: 'Sucre',
        zipCode: '700001',
        contactPerson: 'María González',
        businessType: 'individual',
        taxId: '12345678-9',
        registrationDate: '2024-02-20',
        status: 'active',
        totalAnimals: 55,
        totalWeight: 25350,
        lastActivity: '2024-08-19',
        notes: 'Especializada en ganado de ceba'
      },
      {
        id: '3',
        name: 'Hacienda San José',
        email: 'administracion@haciendaSanJose.com',
        phone: '+57 320 456 7890',
        address: 'Hacienda San José, Sector Los Palmares',
        city: 'Valledupar',
        state: 'Cesar',
        zipCode: '200001',
        contactPerson: 'José Martínez',
        businessType: 'company',
        taxId: '800987654-3',
        registrationDate: '2024-03-10',
        status: 'active',
        totalAnimals: 23,
        totalWeight: 8340,
        lastActivity: '2024-08-18',
        notes: 'Enfoque en ganado joven y reproducción'
      },
      {
        id: '4',
        name: 'Cooperativa Ganadera del Norte',
        email: 'cooperativa@ganaderanorte.coop',
        phone: '+57 315 234 5678',
        address: 'Calle 45 #23-67, Barrio El Centro',
        city: 'Santa Marta',
        state: 'Magdalena',
        zipCode: '470001',
        contactPerson: 'Ana Pérez',
        businessType: 'cooperative',
        taxId: '890123456-7',
        registrationDate: '2024-04-05',
        status: 'inactive',
        totalAnimals: 0,
        totalWeight: 0,
        lastActivity: '2024-07-15',
        notes: 'Cooperativa con 50 asociados'
      }
    ]

    setTimeout(() => {
      setClients(mockClients)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    const matchesBusinessType = businessTypeFilter === 'all' || client.businessType === businessTypeFilter
    return matchesSearch && matchesStatus && matchesBusinessType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspendido</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getBusinessTypeBadge = (type: string) => {
    switch (type) {
      case 'individual':
        return <Badge variant="outline">Individual</Badge>
      case 'company':
        return <Badge variant="outline">Empresa</Badge>
      case 'cooperative':
        return <Badge variant="outline">Cooperativa</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingClient) {
      // Update existing client
      const updatedClient: Client = {
        ...editingClient,
        ...formData,
        lastActivity: new Date().toISOString().split('T')[0]
      }
      setClients(clients.map(client => 
        client.id === editingClient.id ? updatedClient : client
      ))
    } else {
      // Create new client
      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'active',
        totalAnimals: 0,
        totalWeight: 0,
        lastActivity: new Date().toISOString().split('T')[0]
      }
      setClients([...clients, newClient])
    }

    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      contactPerson: '',
      businessType: 'individual',
      taxId: '',
      notes: ''
    })
    setEditingClient(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      contactPerson: client.contactPerson,
      businessType: client.businessType,
      taxId: client.taxId,
      notes: client.notes || ''
    })
    setIsDialogOpen(true)
  }

  const handleNewClient = () => {
    setEditingClient(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      contactPerson: '',
      businessType: 'individual',
      taxId: '',
      notes: ''
    })
    setIsDialogOpen(true)
  }

  const totalActiveClients = clients.filter(c => c.status === 'active').length
  const totalAnimals = clients.reduce((sum, client) => sum + client.totalAnimals, 0)
  const totalWeight = clients.reduce((sum, client) => sum + client.totalWeight, 0)

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
              <Users className="h-8 w-8 mr-3 text-blue-600" />
              Gestión de Clientes
            </h1>
            <p className="text-gray-600 mt-2">Administra la información de tus clientes ganaderos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewClient}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                </DialogTitle>
                <DialogDescription>
                  {editingClient ? 'Modifica la información del cliente' : 'Ingresa los datos del nuevo cliente'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre/Razón Social *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Persona de Contacto *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Tipo de Negocio *</Label>
                    <Select value={formData.businessType} onValueChange={(value: 'individual' | 'company' | 'cooperative') => setFormData({...formData, businessType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="company">Empresa</SelectItem>
                        <SelectItem value="cooperative">Cooperativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">NIT/Cédula *</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Departamento *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingClient ? 'Actualizar' : 'Crear'} Cliente
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Clientes Activos
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalActiveClients}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-blue-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Total de {clients.length} registrados
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Animales
              </CardTitle>
              <Package className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalAnimals.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-green-600 flex items-center">
                  En todos los clientes
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Peso Total
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalWeight.toLocaleString()} kg</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-purple-600 flex items-center">
                  Inventario total
                </span>
              </p>
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
                    placeholder="Buscar por nombre, email o contacto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                    <SelectItem value="suspended">Suspendidos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Empresa</SelectItem>
                    <SelectItem value="cooperative">Cooperativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Gestiona la información de tus clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Animales</TableHead>
                  <TableHead>Peso (kg)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.taxId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {client.phone}
                        </div>
                        <div className="text-sm text-gray-600">{client.contactPerson}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <div>{client.city}, {client.state}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getBusinessTypeBadge(client.businessType)}</TableCell>
                    <TableCell>{client.totalAnimals}</TableCell>
                    <TableCell>{client.totalWeight.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell>
                      {format(new Date(client.lastActivity), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
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