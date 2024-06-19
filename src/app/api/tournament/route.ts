import { connectDatabase } from '@/config/database'
import TournamentModel from '@/models/TournamentModel'
import { NextResponse } from 'next/server'

// Models: Tournament
import '@/models/TournamentModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/tournament
export async function GET() {
  console.log(' - Get Ongoing Tournaments - ')

  try {
    // connect to database
    await connectDatabase()

    // get ongoing tournaments
    const tournaments = await TournamentModel.find({ status: 'ongoing' }).lean()

    // return tournaments
    return NextResponse.json({ tournaments }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
