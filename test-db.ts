import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function createTestData() {
  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
      },
    });

    console.log('Created test user:', user);

    // Create a test form
    const form = await prisma.form.create({
      data: {
        title: 'Test Form',
        description: 'This is a test form',
        schema: JSON.stringify([
          {
            id: '1',
            type: 'text',
            label: 'Name',
            required: true,
          },
          {
            id: '2',
            type: 'email',
            label: 'Email',
            required: true,
          },
        ]),
        settings: JSON.stringify({
          showTitle: true,
          showDescription: true,
          submitButtonText: 'Submit',
          theme: 'light',
        }),
        userId: user.id,
      },
    });

    console.log('Created test form:', form);

    // List all forms to verify
    const allForms = await prisma.form.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    console.log('All forms in database:', allForms);

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
