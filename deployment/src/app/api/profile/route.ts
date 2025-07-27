import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { displayName, email, currentPassword, newPassword } = await request.json()

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    // Update basic profile info
    if (displayName !== undefined) {
      updateData.name = displayName
    }
    
    if (email !== undefined && email !== currentUser.email) {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      
      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json(
          { error: 'Email sudah digunakan oleh user lain' },
          { status: 400 }
        )
      }
      
      updateData.email = email
    }

    // Handle password change
    if (currentPassword && newPassword) {
      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password)
      
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Password saat ini tidak valid' },
          { status: 400 }
        )
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)
      updateData.password = hashedNewPassword
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Profil berhasil diperbarui',
      user: updatedUser
    })
    
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
}
