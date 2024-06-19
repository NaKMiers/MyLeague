import { connectDatabase } from '@/config/database'
import { NextResponse } from 'next/server'

// Models: Team
import '@/models/TeamModel'
import TeamModel from '@/models/TeamModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/admin/team
export async function GET() {
  console.log('- Get All Teams - ')

  try {
    // connect to database
    await connectDatabase()

    // get all teams
    const teams = await TeamModel.find().populate('coach').lean()
    console.log('teams', teams)

    // return teams
    return NextResponse.json({ teams }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
