import { connectDatabase } from '@/config/database'
import '@/models/MatchModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Match
import MatchModel from '@/models/MatchModel'

// [POST]: /api/admin/match/:id/edit
export async function POST(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Edit Match - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from request to add new match
    const { roundId, teams, startedAt, status, results } = await req.json()

    // update match
    const match = await MatchModel.findByIdAndUpdate(
      id,
      { $set: { roundId, teams, startedAt, status, results } },
      { new: true }
    )

    // return new match
    return NextResponse.json({ match }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
