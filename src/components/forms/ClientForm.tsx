"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Client = {
  id?: string;
  name: string;
  phone: string | null;
  city: string | null;
  rfc: string | null;
  curp: string | null;
  address: string | null;
};

interface ClientFormProps {
  initialData?: Client | null;
}

export default function ClientForm({ initialData }: ClientFormProps) {
  const [formData, setFormData] = useState<Client>({
    name: "",
    phone: "",
    city: "",
    rfc: "",
    curp: "",
    address: "",
    ...initialData,
  })
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const url = initialData?.id
      ? `/api/clients/${initialData.id}`
      : "/api/clients"
    const method = initialData?.id ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard/clients")
        router.refresh() // To see the changes in the client list
      } else {
        const errorData = await response.json()
        console.error("Failed to save client:", errorData.error)
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error("An error occurred:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData?.id ? "Edit Client" : "Create New Client"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Número de Teléfono</Label>
              <Input id="phone" value={formData.phone ?? ""} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rfc">RFC</Label>
              <Input id="rfc" value={formData.rfc ?? ""} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="curp">CURP</Label>
              <Input id="curp" value={formData.curp ?? ""} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" value={formData.city ?? ""} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" value={formData.address ?? ""} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
