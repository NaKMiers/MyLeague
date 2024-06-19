import { connectDatabase } from '@/config/database'
import TournamentModel from '@/models/TournamentModel'

// Models: Tournament
import '@/models/TournamentModel'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /api/admin/tournament/:id/classify
export async function GET() {
  console.log(' - Classify Tournament -')

  try {
    // connect to database
    await connectDatabase()

    // calculate and ranking

    // update tournament

    // update teams

    // get tournament
    return NextResponse.json({ message: 'Xếp hạng thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
