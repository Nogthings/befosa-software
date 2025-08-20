import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@befosa.com'
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrator',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    console.log(`✅ Admin user created: ${admin.email}`)
  } else {
    console.log(`ℹ️  Admin user already exists: ${existingAdmin.email}`)
  }

  // Create sample clients
  const clients = [
    {
      name: 'Ganadería El Roble',
      email: 'contacto@elroble.com',
      phone: '+57 300 123 4567',
      address: 'Vereda El Roble, Municipio de Montería, Córdoba'
    },
    {
      name: 'Finca La Esperanza',
      email: 'info@laesperanza.com',
      phone: '+57 310 987 6543',
      address: 'Km 15 Vía Sincelejo, Sucre'
    },
    {
      name: 'Hacienda San José',
      email: 'admin@sanjose.com',
      phone: '+57 320 456 7890',
      address: 'Corregimiento San José, Cesar'
    }
  ]

  for (const clientData of clients) {
    const existingClient = await prisma.client.findUnique({
      where: { email: clientData.email }
    })

    if (!existingClient) {
      const client = await prisma.client.create({
        data: clientData
      })
      console.log(`✅ Client created: ${client.name}`)
    } else {
      console.log(`ℹ️  Client already exists: ${existingClient.name}`)
    }
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })