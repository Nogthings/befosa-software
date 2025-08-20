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

type ClientOption = { label: string; value: string };
type AnimalOption = { label: string; value: string };

type AnimalForSale = {
  id: string;
  tag: string;
  salePrice: string;
};

type InStockAnimal = {
    id: string;
    tag: string;
}

export default function NewExitPage() {
  const [clients, setClients] = useState<ClientOption[]>([])
  const [inStockAnimals, setInStockAnimals] = useState<InStockAnimal[]>([])

  const [selectedClient, setSelectedClient] = useState("")
  const [exitData, setExitData] = useState({
    invoiceNumber: "",
    guideNumber: "",
    exitFolio: "",
    observations: "",
  })

  const [animalsToSell, setAnimalsToSell] = useState<AnimalForSale[]>([])
  const [selectedAnimal, setSelectedAnimal] = useState("")
  const [currentSalePrice, setCurrentSalePrice] = useState("")

  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const clientRes = await fetch("/api/clients")
      if (clientRes.ok) {
        const clientData = await clientRes.json()
        setClients(clientData.map((c) => ({ label: c.name, value: c.id })))
      }

      const animalRes = await fetch("/api/animals/instock")
      if (animalRes.ok) {
        const animalData = await animalRes.json()
        setInStockAnimals(animalData)
      }
    }
    fetchData()
  }, [])

  const handleAddAnimalToSale = () => {
    const animal = inStockAnimals.find(a => a.id === selectedAnimal)
    if (animal && currentSalePrice) {
      setAnimalsToSell([...animalsToSell, { id: animal.id, tag: animal.tag, salePrice: currentSalePrice }])
      // Remove from available options
      setInStockAnimals(inStockAnimals.filter(a => a.id !== selectedAnimal))
      setSelectedAnimal("")
      setCurrentSalePrice("")
    } else {
      alert("Please select an animal and enter a sale price.")
    }
  }

  const handleRemoveAnimalFromSale = (index: number) => {
    const animalToRemove = animalsToSell[index];
    // Add back to in-stock list
    const originalAnimal = {id: animalToRemove.id, tag: animalToRemove.tag}
    setInStockAnimals([...inStockAnimals, originalAnimal])
    // Remove from sale list
    setAnimalsToSell(animalsToSell.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient || animalsToSell.length === 0) {
      alert("Please select a client and add at least one animal to sell.")
      return
    }
    setIsSaving(true)

    const payload = {
      exitData: { ...exitData, clientId: selectedClient },
      animals: animalsToSell,
    }

    try {
      const response = await fetch("/api/exits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push("/dashboard/exits")
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || "Failed to save exit."}`)
      }
    } catch (error) {
      console.error(error)
      alert("An unexpected error occurred.")
    } finally {
      setIsSaving(false)
    }
  }

  const animalOptions = inStockAnimals.map(a => ({ label: a.tag, value: a.id }))

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader><CardTitle>Registrar Nueva Salida de Ganado</CardTitle></CardHeader>
        <CardContent className="space-y-8">
          {/* Exit Data Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datos de la Salida</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Cliente</Label>
                <Combobox options={clients} value={selectedClient} onChange={setSelectedClient} placeholder="Select a client..."/>
              </div>
              <Input id="invoiceNumber" placeholder="No. Factura" value={exitData.invoiceNumber} onChange={(e) => setExitData({...exitData, invoiceNumber: e.target.value})} />
              <Input id="guideNumber" placeholder="No. Guía" value={exitData.guideNumber} onChange={(e) => setExitData({...exitData, guideNumber: e.target.value})} />
              <Input id="exitFolio" placeholder="Folio Salida" value={exitData.exitFolio} onChange={(e) => setExitData({...exitData, exitFolio: e.target.value})} required/>
            </div>
          </div>

          {/* Select Animal Section */}
          <div className="space-y-4">
             <h3 className="text-lg font-medium">Animales a Vender</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                    <Label>Animal (Etiqueta)</Label>
                    <Combobox options={animalOptions} value={selectedAnimal} onChange={setSelectedAnimal} placeholder="Select an animal..." />
                </div>
                <div className="md:col-span-1">
                    <Label>Precio de Venta</Label>
                    <Input type="number" value={currentSalePrice} onChange={(e) => setCurrentSalePrice(e.target.value)} placeholder="0.00" />
                </div>
                <Button type="button" onClick={handleAddAnimalToSale}>Agregar a la Venta</Button>
            </div>
          </div>

          {/* Animals for Sale Table */}
          {animalsToSell.length > 0 && (
            <div>
              <Table>
                <TableHeader><TableRow><TableHead>Etiqueta</TableHead><TableHead>Precio de Venta</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {animalsToSell.map((animal, index) => (
                    <TableRow key={index}>
                      <TableCell>{animal.tag}</TableCell>
                      <TableCell>${parseFloat(animal.salePrice).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveAnimalFromSale(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Registrar Salida"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
