import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isPublished } = await request.json()

    const form = await prisma.form.update({
      where: { id },
      data: { 
        isPublished,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error updating form publish status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
