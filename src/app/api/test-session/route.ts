import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      session: session,
      hasUser: !!session?.user,
      userId: (session?.user as any)?.id
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error getting session' }, { status: 500 })
  }
}
