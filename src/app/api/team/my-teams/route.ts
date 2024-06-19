import { connectDatabase } from '@/config/database'
import TeamModel from '@/models/TeamModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Team
import '@/models/TeamModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/team/my-teams
export async function GET(req: NextRequest) {
  console.log('- Get My Teams -')

  try {
    // connect to database
    await connectDatabase()

    // get token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    const userId = token?._id

    console.log('userId:', userId)

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 })
    }

    // get teams
    const teams = await TeamModel.find({ coach: userId })
      .populate('coach')
      .sort({ createdAt: -1 })
      .lean()

    // return teams
    return NextResponse.json({ teams }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
