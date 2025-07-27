import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      }
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Check if form is published or if user is the owner
    const isOwner = session?.user && (session.user as any).id === form.userId;
    if (!form.isPublished && !isOwner) {
      return NextResponse.json({ error: 'Form is not available' }, { status: 403 })
    }

    // Parse JSON fields
    const formData = {
      ...form,
      schema: JSON.parse(form.schema),
      settings: JSON.parse(form.settings)
    }

    return NextResponse.json(formData)
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, schema, settings } = await request.json()

    const form = await prisma.form.update({
      where: {
        id,
        userId: (session.user as any).id // Ensure user owns the form
      },
      data: {
        title,
        description,
        schema: JSON.stringify(schema),
        settings: JSON.stringify(settings),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.form.delete({
      where: {
        id,
        userId: (session.user as any).id // Ensure user owns the form
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
