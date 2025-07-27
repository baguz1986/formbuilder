import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo users...')
  
  // Hash password untuk semua demo users
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  // Buat demo users
  const users = [
    {
      email: 'bagus@example.com',
      name: 'Bagus Taryana',
      password: hashedPassword,
      role: 'super_admin',
      status: 'active'
    },
    {
      email: 'admin@example.com', 
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    },
    {
      email: 'user@example.com',
      name: 'Regular User', 
      password: hashedPassword,
      role: 'user',
      status: 'active'
    }
  ]
  
  for (const user of users) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      })
      
      if (!existingUser) {
        await prisma.user.create({
          data: user
        })
        console.log(`✅ Created ${user.role}: ${user.email}`)
      } else {
        console.log(`ℹ️  User ${user.email} already exists`)
      }
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error)
    }
  }
  
  console.log('✨ Demo users seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
