import { connectDatabase } from '@/config/database'
import '@/models/MatchModel'
import MatchModel, { IMatch } from '@/models/MatchModel'
import RoundModel, { IRound } from '@/models/RoundModel'
import TeamModel from '@/models/TeamModel'
import TournamentModel, { ITournament } from '@/models/TournamentModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tournament, Team, Round, Match
import '@/models/MatchModel'
import '@/models/RoundModel'
import '@/models/TeamModel'
import '@/models/TournamentModel'

// [GET]: /api/admin/tournament/:id/delete
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Get Tournament - ')

  try {
    // connect to database
    await connectDatabase()

    // get tournament
    const tournament: ITournament | null = await TournamentModel.findById(id).lean()

    // check if tournament exists
    if (!tournament) {
      return NextResponse.json({ message: 'Không tìm thấy giải đấu' }, { status: 404 })
    }

    const teamQuantity = await TeamModel.countDocuments({ tournamentId: id })
    tournament.teamQuantity = teamQuantity

    // get rounds of tournament
    const rounds: IRound[] = await RoundModel.find({ tournamentId: id }).lean()

    // get matches of tournament
    const matches: IMatch[] = await MatchModel.find({ tournamentId: id }).populate('teams').lean()

    // add matches to corresponding rounds
    rounds.forEach(round => {
      round.matches = matches.filter(match => match.roundId.toString() === round._id.toString())
    })

    // return tournament
    return NextResponse.json({ tournament, rounds }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
