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

    // get all teams of tournament
    const teams = await TeamModel.find({ tournamentId: id }).lean()

    // ranking
    const teamRankings: {
      [key: string]: {
        win: number
        lose: number
        draw: number
        goal: number
      }
    } = {}

    // calculate ranking
    matches.forEach(match => {
      match.teams.forEach((team: any) => {
        if (!teamRankings[team._id]) {
          teamRankings[team._id] = {
            win: 0,
            lose: 0,
            draw: 0,
            goal: 0,
          }
        }

        match.results.forEach((result: any) => {
          if (result.teamId.toString() === team._id.toString()) {
            teamRankings[team._id].goal += result.goal
          }
        })
      })
    })

    matches.forEach(match => {
      const result1 = match.results[0]
      const result2 = match.results[1]

      if (result1.goal > result2.goal) {
        teamRankings[result1.teamId].win++
        teamRankings[result2.teamId].lose++
      } else if (result1.score < result2.score) {
        teamRankings[result1.teamId].lose++
        teamRankings[result2.teamId].win++
      } else {
        teamRankings[result1.teamId].draw++
        teamRankings[result2.teamId].draw++
      }
    })

    const sortedTeamRankings = Object.entries(teamRankings).sort((a, b) => {
      return b[1].win - a[1].win || b[1].goal - a[1].goal
    })

    const ranks = sortedTeamRankings.map(([teamId, { win, lose, draw, goal }], index) => {
      const team = teams.find((team: any) => team._id.toString() === teamId)
      return {
        ...team,
        rank: index + 1,
        win,
        lose,
        draw,
        goal,
      }
    })

    // return tournament
    return NextResponse.json({ tournament, rounds, teams, ranks }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
