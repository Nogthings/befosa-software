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

type Entry = {
  id: string;
  guideNumber: string | null;
  invoiceNumber: string | null;
  entryFolio: string;
  _count: {
    details: number;
  };
  totalWeight: number;
  client: {
    name: string;
  };
  // These fields are not in the model yet, will be added later
  status?: string;
  total?: number;
};

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch("/api/entries")
        if (response.ok) {
          const data = await response.json()
          setEntries(data)
        } else {
          console.error("Failed to fetch entries")
        }
      } catch (error) {
        console.error("An error occurred while fetching entries:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Entradas de Ganado</CardTitle>
            <CardDescription>
              Administra las entradas de ganado.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/entries/new">Registrar Entrada</Link>
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
              <TableHead>Peso(Kg)</TableHead>
              <TableHead>Cliente</TableHead>
              {/* <TableHead>Estatus</TableHead>
              <TableHead>Total</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : entries.length > 0 ? (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{entry.invoiceNumber}</TableCell>
                  <TableCell>{entry.entryFolio}</TableCell>
                  <TableCell>{entry._count.details}</TableCell>
                  <TableCell>{entry.totalWeight.toFixed(2)}</TableCell>
                  <TableCell>{entry.client.name}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
