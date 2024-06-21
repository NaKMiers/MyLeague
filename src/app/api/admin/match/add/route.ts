import { connectDatabase } from '@/config/database'
import '@/models/MatchModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Match
import MatchModel from '@/models/MatchModel'

// [POST]: /api/admin/match/add
export async function POST(req: NextRequest) {
  console.log(' - Add Match - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from request to add new match
    const { tournamentId, roundId, team1, team2, startedAt } = await req.json()

    // create new match
    let match = await MatchModel.create({
      tournamentId,
      roundId,
      teams: [team1, team2],
      startedAt,
    })

    // get match
    match = await MatchModel.findById(match._id).populate('teams').lean()

    // return new match
    return NextResponse.json({ match, message: 'Thêm trận thành công' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
