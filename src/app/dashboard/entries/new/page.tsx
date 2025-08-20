"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { X } from "lucide-react"

type ClientOption = {
  label: string;
  value: string;
};

type AnimalData = {
  tag: string;
  weight: string;
  price: string;
  pen: string;
  species: string;
};

export default function NewEntryPage() {
  const [clients, setClients] = useState<ClientOption[]>([])
  const [selectedClient, setSelectedClient] = useState("")
  const [entryData, setEntryData] = useState({
    invoiceNumber: "",
    guideNumber: "",
    entryFolio: "",
    observations: "",
  })
  const [animals, setAnimals] = useState<AnimalData[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<AnimalData>({
    tag: "",
    weight: "",
    price: "",
    pen: "",
    species: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchClients() {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data.map((c) => ({ label: c.name, value: c.id })))
      }
    }
    fetchClients()
  }, [])

  const handleEntryDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setEntryData((prev) => ({ ...prev, [id]: value }))
  }

  const handleAnimalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCurrentAnimal((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddAnimal = () => {
    if (currentAnimal.tag && currentAnimal.weight && currentAnimal.price) {
      setAnimals([...animals, currentAnimal])
      setCurrentAnimal({ tag: "", weight: "", price: "", pen: "", species: "" })
    } else {
      alert("Please fill in at least Tag, Weight, and Price for the animal.")
    }
  }

  const handleRemoveAnimal = (index: number) => {
    setAnimals(animals.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient || animals.length === 0) {
      alert("Please select a client and add at least one animal.")
      return
    }
    setIsSaving(true)

    const payload = {
      entryData: { ...entryData, clientId: selectedClient },
      animals: animals,
    }

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push("/dashboard/entries")
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || "Failed to save entry."}`)
      }
    } catch (error) {
      console.error(error)
      alert("An unexpected error occurred.")
    } finally {
      setIsSaving(false)
    }
  }

  const totalWeight = animals.reduce((sum, animal) => sum + parseFloat(animal.weight || "0"), 0)
  const totalAmount = animals.reduce((sum, animal) => sum + parseFloat(animal.price || "0"), 0)

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nueva Entrada de Ganado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Entry Data Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos de la Entrada</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Cliente</Label>
                <Combobox
                  options={clients}
                  value={selectedClient}
                  onChange={setSelectedClient}
                  placeholder="Select a client..."
                  searchPlaceholder="Search clients..."
                  emptyText="No clients found."
                />
              </div>
              <div>
                <Label htmlFor="invoiceNumber">No. Factura</Label>
                <Input id="invoiceNumber" value={entryData.invoiceNumber} onChange={handleEntryDataChange} />
              </div>
              <div>
                <Label htmlFor="guideNumber">No. Guía</Label>
                <Input id="guideNumber" value={entryData.guideNumber} onChange={handleEntryDataChange} />
              </div>
              <div>
                <Label htmlFor="entryFolio">Folio Entrada</Label>
                <Input id="entryFolio" value={entryData.entryFolio} onChange={handleEntryDataChange} required/>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="observations">Observaciones</Label>
                <Input id="observations" value={entryData.observations} onChange={handleEntryDataChange} />
              </div>
            </div>
          </div>

          {/* Add Animal Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalle de la Entrada</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div className="md:col-span-1">
                <Label htmlFor="tag">Etiqueta</Label>
                <Input id="tag" value={currentAnimal.tag} onChange={handleAnimalDataChange} />
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="weight">Peso (Kg)</Label>
                <Input id="weight" type="number" value={currentAnimal.weight} onChange={handleAnimalDataChange} />
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="price">Importe</Label>
                <Input id="price" type="number" value={currentAnimal.price} onChange={handleAnimalDataChange} />
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="pen">Corral</Label>
                <Input id="pen" value={currentAnimal.pen} onChange={handleAnimalDataChange} />
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="species">Especie</Label>
                <Input id="species" value={currentAnimal.species} onChange={handleAnimalDataChange} />
              </div>
              <Button type="button" onClick={handleAddAnimal} className="w-full md:w-auto">
                Agregar
              </Button>
            </div>
          </div>

          {/* Animals Table */}
          {animals.length > 0 && (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etiqueta</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Corral</TableHead>
                    <TableHead>Especie</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {animals.map((animal, index) => (
                    <TableRow key={index}>
                      <TableCell>{animal.tag}</TableCell>
                      <TableCell>{animal.weight}</TableCell>
                      <TableCell>{animal.price}</TableCell>
                      <TableCell>{animal.pen}</TableCell>
                      <TableCell>{animal.species}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveAnimal(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end space-x-4 mt-4 text-sm font-medium">
                  <p>Unidades: {animals.length}</p>
                  <p>Peso total: {totalWeight.toFixed(2)}kg</p>
                  <p>Importe Total: ${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Registrar Entrada"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
