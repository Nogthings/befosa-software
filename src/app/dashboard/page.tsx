"use client"

import { useState, useEffect } from "react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp } from "lucide-react";

type Stats = {
  inventoryValue: number;
  headCount: number;
  totalProfit: number;
  clientCount: number;
  chartData: {
    estimated: { month: string; value: number }[];
    achieved: { month: string; value: number }[];
  };
  weeklySalesData: { day: string; sales: number; goal: number }[];
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  if (!stats) {
    return <div>Failed to load dashboard data.</div>
  }

  const combinedChartData = stats.chartData.estimated.map((est, i) => ({
    name: est.month,
    Ganancias_Estimadas: est.value,
    Ganancia_Alcanzada: stats.chartData.achieved[i].value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor de Inventario</CardTitle>
            <span className="text-2xl">🇲🇽</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.inventoryValue.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> 1.43%
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia</CardTitle>
            <span className="text-2xl">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalProfit.toLocaleString()}</div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> 5.35%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cabezas de Ganado</CardTitle>
            <span className="text-2xl">🐄</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.headCount}</div>
             <p className="text-xs text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> 4.59%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clientCount}</div>
             <p className="text-xs text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> 1.95%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Ganancias Estimadas vs. Alcanzadas</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={combinedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Ganancias_Estimadas" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="Ganancia_Alcanzada" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Ventas de la Semana</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stats.weeklySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Ventas" />
                <Bar dataKey="goal" fill="#82ca9d" name="Objetivo" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
