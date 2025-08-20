const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
require('dotenv').config()

const prisma = new PrismaClient()

async function createDefaultAdmin() {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@befosa.com'
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', adminEmail)
      return existingAdmin
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrator',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ Default admin user created successfully!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Password:', adminPassword)
    console.log('⚠️  Please change the default password after first login')
    
    return adminUser
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  createDefaultAdmin()
    .then(() => {
      console.log('🎉 Seed completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seed failed:', error)
      process.exit(1)
    })
}

module.exports = { createDefaultAdmin }