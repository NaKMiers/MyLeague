import { connectDatabase } from '@/config/database'
import TournamentModel from '@/models/TournamentModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tournament
import '@/models/TournamentModel'

// [POST]: /api/admin/tournament/add
export async function POST(req: NextRequest) {
  console.log(' - Add Tournament - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from request to add tournament
    const { name, type, gender, startedAt, endedAt, note } = await req.json()

    // add tournament
    const tournament = await TournamentModel.create({
      name,
      type,
      gender,
      startedAt,
      endedAt,
      note,
    })

    // return tournament
    return NextResponse.json({ tournament, message: 'Tạo giải đấu thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
