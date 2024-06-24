import { connectDatabase } from '@/config/database'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tournament
import MatchModel from '@/models/MatchModel'
import '@/models/TournamentModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/admin/tournament/:id/ranking
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Ranking Tournament - ')

  try {
    // connect to database
    await connectDatabase()

    // get all matches of tournament
    const matches = await MatchModel.find({ tournamentId: id }).lean()

    const teamRankings: { [key: string]: number } = {}
    const isAbleToRanking = matches.every(match => match.results.length >= 2)

    // check if all matches have results
    if (!isAbleToRanking) {
      return NextResponse.json({ message: 'Chưa thể xếp hạn vào lúc này' }, { status: 400 })
    }

    // calculate ranking
    matches.forEach(match => {
      match.results.forEach((result: any) => {
        if (!teamRankings[result.teamId]) {
          teamRankings[result.teamId] = 0
        }

        teamRankings[result.teamId] += result.goal
      })
    })

    return NextResponse.json({ message: 'Hello' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ messsage: err.message }, { status: 500 })
  }
}
