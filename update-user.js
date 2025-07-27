const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function updateUserPassword() {
  try {
    // Hash password dengan bcrypt
    const hashedPassword = await bcrypt.hash('Bagus1986', 12);
    
    // Update user password
    const user = await prisma.user.upsert({
      where: { email: 'bagustaryana@gmail.com' },
      update: {
        password: hashedPassword
      },
      create: {
        email: 'bagustaryana@gmail.com',
        name: 'Bagus Taryana',
        password: hashedPassword
      }
    });
    
    console.log('User updated/created:', user.email);
    console.log('Password hash set successfully');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserPassword();
