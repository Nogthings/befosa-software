"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Exit = {
  id: string;
  guideNumber: string | null;
  invoiceNumber: string | null;
  exitFolio: string;
  _count: {
    details: number;
  };
  totalProfit: number;
  // These fields need to be calculated or added to the API response
  totalWeight: number;
  totalAmount: number;
};

export default function ExitsPage() {
  const [exits, setExits] = useState<Exit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExits() {
      try {
        const response = await fetch("/api/exits")
        if (response.ok) {
          // A more complex mapping would be needed if the API doesn't provide all fields directly
          const data = await response.json()
          setExits(data)
        } else {
          console.error("Failed to fetch exits")
        }
      } catch (error) {
        console.error("An error occurred while fetching exits:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchExits()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Salidas de Ganado</CardTitle>
            <CardDescription>
              Administra las salidas o ventas de ganado.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/exits/new">Registrar Salida</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guía</TableHead>
              <TableHead>Factura</TableHead>
              <TableHead>Folio</TableHead>
              <TableHead>Cantidad</TableHead>
              {/* <TableHead>Peso(Kg)</TableHead>
              <TableHead>Total</TableHead> */}
              <TableHead>Ganancia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : exits.length > 0 ? (
              exits.map((exit) => (
                <TableRow key={exit.id}>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{exit.invoiceNumber}</TableCell>
                  <TableCell>{exit.exitFolio}</TableCell>
                  <TableCell>{exit._count.details}</TableCell>
                  <TableCell>${exit.totalProfit.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No exits found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
