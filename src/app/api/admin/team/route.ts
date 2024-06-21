import { connectDatabase } from '@/config/database'
import { NextRequest, NextResponse } from 'next/server'
import TeamModel from '@/models/TeamModel'

// Models: Team, Tournament
import '@/models/TeamModel'
import '@/models/TournamentModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/admin/team
export async function GET(req: NextRequest) {
  console.log('- Get All Teams - ')

  try {
    // connect to database
    await connectDatabase()

    // get search query
    const params: { [key: string]: string[] } = {}
    for (let key of Array.from(req.nextUrl.searchParams.keys())) {
      params[key] = req.nextUrl.searchParams.getAll(key)
    }

    const filter: { [key: string]: any } = {}
    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    console.log('Filter:', filter)

    // get all teams
    const teams = await TeamModel.find(filter).populate('coach tournamentId').lean()

    console.log('Teams:', teams)

    // return teams
    return NextResponse.json({ teams }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
