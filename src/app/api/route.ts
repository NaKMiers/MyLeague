import { connectDatabase } from '@/config/database'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /
export async function GET(req: NextRequest) {
  console.log('- Get Home Page - ')

  try {
    // connect to database
    await connectDatabase()

    // get token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    console.log('token', token)

    return NextResponse.json({ message: 'Home Page' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
