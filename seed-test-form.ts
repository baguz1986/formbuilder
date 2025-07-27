import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTestForm() {
  // Create a test user first (if not exists)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password_here', // In real app, this should be hashed
    },
  })

  // Create a test form
  const testForm = await prisma.form.create({
    data: {
      title: 'Test Form',
      description: 'This is a test form',
      schema: JSON.stringify([
        {
          id: '1',
          type: 'text',
          label: 'Your Name',
          placeholder: 'Enter your name',
          required: true,
        },
        {
          id: '2',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
        },
        {
          id: '3',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message',
          required: false,
        },
      ]),
      settings: JSON.stringify({
        showTitle: true,
        showDescription: true,
        submitButtonText: 'Submit',
        theme: 'light',
      }),
      isPublished: false,
      views: 0,
      userId: testUser.id,
    },
  })

  console.log('Test form created:', testForm)
}

seedTestForm()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
