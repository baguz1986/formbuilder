const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  try {
    // Check all forms
    const forms = await prisma.form.findMany({
      include: {
        user: {
          select: { email: true, name: true }
        },
        submissions: true
      }
    });
    
    console.log('=== ALL FORMS ===');
    forms.forEach(form => {
      console.log(`Form ID: ${form.id}`);
      console.log(`Title: ${form.title}`);
      console.log(`Owner: ${form.user.email} (${form.user.name})`);
      console.log(`Submissions: ${form.submissions.length}`);
      console.log('---');
    });
    
    // Check all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true }
    });
    
    console.log('\n=== ALL USERS ===');
    users.forEach(user => {
      console.log(`User ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
