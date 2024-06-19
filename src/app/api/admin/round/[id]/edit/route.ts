import { connectDatabase } from '@/config/database'
import RoundModel from '@/models/RoundModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Round
import '@/models/RoundModel'

// [POST]: /api/admin/round/:id/edit
export async function POST(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Edit Round - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from request to add round
    const { name, startedAt, endedAt, result } = await req.json()

    // edit round
    const round = await RoundModel.findByIdAndUpdate(
      id,
      {
        name,
        startedAt,
        endedAt,
        result,
      },
      { new: true }
    )

    if (!round) {
      return NextResponse.json({ message: 'Vòng đấu không tồn tại' }, { status: 404 })
    }

    // return round
    return NextResponse.json({ round, message: 'Sửa vòng đấu thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
