import { connectDatabase } from '@/config/database'
import '@/models/MatchModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Match
import MatchModel from '@/models/MatchModel'

// [DELETE]: /api/admin/match/:id/delete
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Delete Match - ')

  try {
    // connect to database
    await connectDatabase()

    // delete match
    const match = await MatchModel.findByIdAndDelete(id).lean()

    // check if match exists
    if (!match) {
      return NextResponse.json({ message: 'Không tìm thấy trận' }, { status: 404 })
    }

    // return new match
    return NextResponse.json({ match, message: 'Xóa trận thành công' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
