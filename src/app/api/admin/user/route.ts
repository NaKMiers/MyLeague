import { connectDatabase } from '@/config/database'
import '@/models/UserModel'
import { NextResponse } from 'next/server'

// Models: User
import UserModel from '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/admin/user
export async function GET() {
  console.log(' - Get All Role Users - ')

  try {
    // connect to database
    await connectDatabase()

    // get ongoing users
    const users = await UserModel.find({
      role: {
        $in: ['coach', 'admin', 'employee'],
      },
    }).lean()

    // return users
    return NextResponse.json({ users }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
