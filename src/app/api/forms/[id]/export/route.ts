import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: formId } = await params;

    // Get form with submissions
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        user: {
          email: session.user.email
        }
      },
      include: {
        submissions: true
      }
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const formSchema = JSON.parse(form.schema);
    const submissions = form.submissions.map((sub: any) => ({
      id: sub.id,
      data: JSON.parse(sub.data),
      submittedAt: sub.submittedAt,
      ipAddress: sub.ipAddress,
      userAgent: sub.userAgent
    }));

    // Prepare Excel data
    const excelData = prepareExcelData(formSchema, submissions);

    return NextResponse.json({
      filename: `${form.title.replace(/[^a-zA-Z0-9]/g, '_')}_submissions.xlsx`,
      data: excelData
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function prepareExcelData(formSchema: any, submissions: any[]) {
  // Prepare headers
  const headers = ['Submission ID', 'Submitted At', 'IP Address'];
  
  // Add field headers
  if (formSchema.fields) {
    formSchema.fields.forEach((field: any) => {
      if (field.type === 'matrix') {
        // For matrix fields, create separate columns for each row
        if (field.rows) {
          field.rows.forEach((row: any) => {
            headers.push(`${field.label} - ${row.value}`);
          });
        }
      } else if (field.type === 'likert') {
        // For Likert fields, create separate columns for each question
        if (field.questions) {
          field.questions.forEach((question: any) => {
            headers.push(`${field.label} - ${question.text}`);
          });
        }
      } else {
        headers.push(field.label);
      }
    });
  }

  // Prepare rows
  const rows = submissions.map(submission => {
    const row = [
      submission.id,
      new Date(submission.submittedAt).toLocaleString(),
      submission.ipAddress || 'N/A'
    ];

    // Add field data
    if (formSchema.fields) {
      formSchema.fields.forEach((field: any) => {
        const value = submission.data[field.id];
        
        if (field.type === 'matrix' && field.rows) {
          // For matrix fields, add each row's response
          field.rows.forEach((matrixRow: any) => {
            const rowValue = value?.[matrixRow.id] || '';
            row.push(rowValue);
          });
        } else if (field.type === 'likert' && field.questions) {
          // For Likert fields, add each question's response
          field.questions.forEach((question: any) => {
            const questionValue = value?.[question.id] || '';
            row.push(questionValue);
          });
        } else {
          // For other field types
          let cellValue = '';
          
          if (Array.isArray(value)) {
            cellValue = value.join(', ');
          } else if (typeof value === 'object' && value !== null) {
            cellValue = JSON.stringify(value);
          } else {
            cellValue = value?.toString() || '';
          }
          
          row.push(cellValue);
        }
      });
    }

    return row;
  });

  return {
    headers,
    rows,
    title: formSchema.title || 'Form Submissions'
  };
}
