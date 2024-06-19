import { connectDatabase } from '@/config/database'
import TournamentModel from '@/models/TournamentModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tournament
import '@/models/TournamentModel'

// [DELETE]: /api/admin/tournament/:id/delete
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - DeDelete Tournament - ')

  try {
    // connect to database
    await connectDatabase()

    // delete tournament
    await TournamentModel.findByIdAndDelete(id)

    // return tournament
    return NextResponse.json({ message: 'Xóa giải đấu thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
