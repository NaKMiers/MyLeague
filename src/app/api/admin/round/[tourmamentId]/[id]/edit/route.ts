import { connectDatabase } from '@/config/database'
import RoundModel from '@/models/RoundModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Round
import '@/models/RoundModel'

// [PUT]: /api/admin/round/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Edit Round - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from request to add round
    let { name, startedAt, endedAt, result } = await req.json()

    if (!result.winner) {
      result = {
        ...result,
        winner: null,
      }
    }

    // edit round
    const round = await RoundModel.findByIdAndUpdate(
      id,
      { $set: { name, startedAt, endedAt, result } },
      { new: true }
    )

    if (!round) {
      return NextResponse.json({ message: 'Vòng đấu không tồn tại' }, { status: 404 })
    }

    // return round
    return NextResponse.json({ round, message: 'Cập nhật vòng đấu thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
