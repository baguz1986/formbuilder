const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestForm() {
  try {
    // Get the second user (bagustaryana@gmail.com)
    const user = await prisma.user.findUnique({
      where: { email: 'bagustaryana@gmail.com' }
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Creating form for user:', user.email);
    
    // Create a test form with sample data
    const form = await prisma.form.create({
      data: {
        title: 'Survey Analytics Test',
        description: 'Form untuk testing analytics dengan data lengkap',
        schema: JSON.stringify({
          title: 'Survey Analytics Test',
          description: 'Form untuk testing analytics dengan data lengkap',
          fields: [
            {
              id: 'field1',
              type: 'text',
              label: 'Nama Lengkap',
              required: true
            },
            {
              id: 'field2',
              type: 'multiple-choice',
              label: 'Pilihan Favorit',
              required: true,
              options: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' }
              ]
            },
            {
              id: 'field3',
              type: 'rating',
              label: 'Rating Kepuasan',
              required: false,
              min: 1,
              max: 5
            },
            {
              id: 'field4',
              type: 'textarea',
              label: 'Komentar',
              required: false
            }
          ],
          settings: {
            submitButtonText: 'Submit Survey',
            showTitle: true,
            showDescription: true,
            redirectUrl: ''
          }
        }),
        settings: JSON.stringify({
          submitButtonText: 'Submit Survey',
          showTitle: true,
          showDescription: true,
          redirectUrl: ''
        }),
        isPublished: true,
        userId: user.id
      }
    });
    
    console.log('Form created:', form.id);
    
    // Create some sample submissions
    const submissions = [
      {
        field1: 'John Doe',
        field2: 'option1',
        field3: 5,
        field4: 'Sangat bagus!'
      },
      {
        field1: 'Jane Smith',
        field2: 'option2',
        field3: 4,
        field4: 'Cukup memuaskan'
      },
      {
        field1: 'Bob Johnson',
        field2: 'option1',
        field3: 5,
        field4: 'Excellent service'
      },
      {
        field1: 'Alice Brown',
        field2: 'option3',
        field3: 3,
        field4: 'Could be better'
      },
      {
        field1: 'Charlie Wilson',
        field2: 'option2',
        field3: 4,
        field4: 'Good overall'
      }
    ];
    
    for (let i = 0; i < submissions.length; i++) {
      await prisma.formSubmission.create({
        data: {
          formId: form.id,
          data: JSON.stringify(submissions[i]),
          ipAddress: '192.168.1.' + (100 + i),
          userAgent: 'Mozilla/5.0 (Test Browser)'
        }
      });
    }
    
    console.log('Created', submissions.length, 'sample submissions');
    console.log('Form URL: http://localhost:3003/forms/' + form.id + '/analytics');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestForm();
