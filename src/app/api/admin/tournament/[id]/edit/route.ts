import { connectDatabase } from '@/config/database'
import TournamentModel from '@/models/TournamentModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tournament
import '@/models/TournamentModel'

// [POST]: /api/admin/tournament/:id/edit
export async function POST(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Edit Tournament - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from request to add tournament
    const { name, type, gender, startedAt, endedAt, note } = await req.json()

    // edit tournament
    const tournament = await TournamentModel.findByIdAndUpdate(
      id,
      {
        name,
        type,
        gender,
        startedAt,
        endedAt,
        note,
      },
      { new: true }
    )

    // return tournament
    return NextResponse.json({ tournament, message: 'Sửa giải đấu thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
