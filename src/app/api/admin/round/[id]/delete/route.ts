import { connectDatabase } from '@/config/database'
import RoundModel from '@/models/RoundModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Round
import '@/models/RoundModel'

// [DELETE]: /api/admin/round/:id/delete
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Delete Round - ')

  try {
    // connect to database
    await connectDatabase()

    // delete round
    await RoundModel.findByIdAndDelete(id)

    // return round
    return NextResponse.json({ message: 'Xóa vòng đấu thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
