import { connectDatabase } from '@/config/database'
import MatchModel from '@/models/MatchModel'
import TournamentModel from '@/models/TournamentModel'
import { NextRequest, NextResponse } from 'next/server'
import moment from 'moment'

// Models: User, Tournament, Match
import '@/models/MatchModel'
import '@/models/TournamentModel'
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// Set monday as the first day of the week
moment.updateLocale('en', {
  week: {
    dow: 1,
  },
})

// [GET]: /
export async function GET(req: NextRequest) {
  console.log('- Get Home Page - ')

  try {
    // connect to database
    await connectDatabase()

    // get ongoing tournaments
    const tournaments = await TournamentModel.find({ status: 'ongoing' }).lean()

    // Get the current date
    const currentDate = moment()
    const firstDayOfWeek = moment().startOf('week')
    const lastDayOfWeek = moment().endOf('week')

    const matches = await MatchModel.find({
      startedAt: {
        $gte: firstDayOfWeek.toDate(),
        $lt: lastDayOfWeek.toDate(),
      },
    }).populate('teams')

    // return data
    return NextResponse.json({ tournaments, matches }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
