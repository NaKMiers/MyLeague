import { connectDatabase } from '@/config/database'
import TeamModel from '@/models/TeamModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Team
import '@/models/TeamModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/team/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get Team Detail Page - ')

  try {
    // connect to database
    await connectDatabase()

    // get team
    const team = await TeamModel.findOne({ _id: id, status: 'active' })
      .populate(['players', 'coach'])
      .lean()

    return NextResponse.json({ team }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
