import { connectDatabase } from '@/config/database'
import MatchModel from '@/models/MatchModel'
import { NextResponse } from 'next/server'

// Models: Match
import '@/models/MatchModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/admin/matches
export async function GET() {
  console.log('- Get All Matches - ')

  try {
    // connect to database
    await connectDatabase()

    // get all matches
    const matches = await MatchModel.find().lean()

    // return matches
    return NextResponse.json({ matches }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
