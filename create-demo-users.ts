import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createDemoUsers() {
  try {
    // Hash password untuk semua user demo
    const hashedPassword = await bcrypt.hash('123456', 10)

    // Buat Super Admin
    await prisma.user.upsert({
      where: { email: 'bagus@example.com' },
      update: {},
      create: {
        email: 'bagus@example.com',
        name: 'Bagus Taryana',
        password: hashedPassword,
        role: 'super_admin',
        status: 'active'
      }
    })

    // Buat Admin
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
        status: 'active'
      }
    })

    // Buat User biasa
    await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Regular User',
        password: hashedPassword,
        role: 'user',
        status: 'active'
      }
    })

    console.log('Demo users created successfully!')
    console.log('Super Admin: bagus@example.com / 123456')
    console.log('Admin: admin@example.com / 123456')
    console.log('User: user@example.com / 123456')

  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoUsers()
