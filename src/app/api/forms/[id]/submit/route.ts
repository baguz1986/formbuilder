import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Verify form exists and is published
    const form = await prisma.form.findUnique({
      where: { id }
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (!form.isPublished) {
      return NextResponse.json({ error: 'Form is not accepting submissions' }, { status: 403 })
    }

    // Save submission
    const submission = await prisma.formSubmission.create({
      data: {
        formId: id,
        data: JSON.stringify(formData),
        ipAddress,
        userAgent
      }
    })

    // Update form analytics
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.formAnalytics.upsert({
      where: {
        formId_date: {
          formId: id,
          date: today
        }
      },
      update: {
        responses: {
          increment: 1
        }
      },
      create: {
        formId: id,
        date: today,
        responses: 1
      }
    })

    return NextResponse.json({ 
      success: true, 
      submissionId: submission.id 
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
