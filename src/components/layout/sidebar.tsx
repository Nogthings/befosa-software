'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Beef,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Vista general del sistema'
  },
  {
    name: 'Entradas',
    href: '/livestock/entries',
    icon: ArrowUpCircle,
    description: 'Registro de entradas de ganado'
  },
  {
    name: 'Salidas',
    href: '/livestock/exits',
    icon: ArrowDownCircle,
    description: 'Registro de salidas de ganado'
  },
  {
    name: 'Inventario',
    href: '/livestock/inventory',
    icon: Beef,
    description: 'Estado actual del hato'
  },
  {
    name: 'Clientes',
    href: '/clients',
    icon: Users,
    description: 'Gestión de clientes'
  },
  {
    name: 'Reportes',
    href: '/reports',
    icon: FileText,
    description: 'Informes y estadísticas'
  },
  {
    name: 'Análisis',
    href: '/analytics',
    icon: BarChart3,
    description: 'Análisis de datos'
  }
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className={cn(
      'flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-2">
              <Beef className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BEFOSA</h1>
              <p className="text-xs text-gray-500">Gestión Ganadera</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-100 text-green-900 border border-green-200'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.description : undefined}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'text-green-600')} />
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start space-x-3 h-auto p-3',
                isCollapsed && 'justify-center'
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-100 text-green-700">
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}