"use client"

import { useState, useEffect } from "react"
import ClientForm from "@/components/forms/ClientForm"

interface EditClientPageProps {
  params: {
    id: string;
  };
}

type Client = {
  id: string;
  name: string;
  phone: string | null;
  city: string | null;
  rfc: string | null;
  curp: string | null;
  address: string | null;
};

export default function EditClientPage({ params }: EditClientPageProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await fetch(`/api/clients/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setClient(data)
        } else {
          setError("Failed to fetch client data.")
        }
      } catch (err) {
        setError("An error occurred while fetching client data.")
      } finally {
        setLoading(false)
      }
    }
    fetchClient()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return <ClientForm initialData={client} />
}
