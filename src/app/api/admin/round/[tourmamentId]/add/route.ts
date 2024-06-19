import { connectDatabase } from '@/config/database'
import RoundModel from '@/models/RoundModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Round
import '@/models/RoundModel'

// [POST]: /api/admin/round/:tourmamentId/add
export async function POST(
  req: NextRequest,
  { params: { tourmamentId } }: { params: { tourmamentId: string } }
) {
  console.log(' - Add Round To Tournament - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from request to add round
    const { name, startedAt, endedAt } = await req.json()

    // add round
    const round = await RoundModel.create({
      tournamentId: tourmamentId,
      name,
      startedAt,
      endedAt,
    })

    // return round
    return NextResponse.json({ round, message: 'Tạo vòng đấu thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
