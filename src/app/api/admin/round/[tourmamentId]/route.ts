import { connectDatabase } from '@/config/database'
import RoundModel from '@/models/RoundModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Round
import '@/models/RoundModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/admin/round/:tourmamentId
export async function GET(
  req: NextRequest,
  { params: { tourmamentId } }: { params: { tourmamentId: string } }
) {
  console.log(' - Get Round Of Tournament - ')

  try {
    // connect to database
    await connectDatabase()

    // get round
    const rounds = await RoundModel.find({ tourmamentId }).lean()

    // return rounds
    return NextResponse.json({ rounds }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
