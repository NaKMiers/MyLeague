import { connectDatabase } from '@/config/database'
import RoundModel from '@/models/RoundModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Round
import '@/models/RoundModel'
import MatchModel from '@/models/MatchModel'

// [DELETE]: /api/admin/round/:id/delete
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Delete Round - ')

  try {
    // connect to database
    await connectDatabase()

    // get round by id
    const round = await RoundModel.findById(id).lean()

    // check if round exists
    if (!round) {
      return NextResponse.json({ message: 'Không tìm thấy vòng đấu' }, { status: 404 })
    }

    // get matches of round
    const matchQuantity = await MatchModel.countDocuments({ roundId: id })

    // check matches of round
    if (matchQuantity > 0) {
      return NextResponse.json({ message: 'Vòng đấu đang chứa trận đấu' }, { status: 400 })
    }

    // delete round
    await RoundModel.findByIdAndDelete(id)

    // return round
    return NextResponse.json({ message: 'Xóa vòng đấu thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
