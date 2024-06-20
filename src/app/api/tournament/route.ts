import { connectDatabase } from '@/config/database'
import TournamentModel from '@/models/TournamentModel'
import { NextResponse } from 'next/server'

// Models: Tournament
import '@/models/TournamentModel'
import UserModel from '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /api/tournament
export async function GET() {
  console.log(' - Get Ongoing Tournaments - ')

  try {
    // connect to database
    await connectDatabase()

    // create admin
    await UserModel.create({
      fullName: 'Nguyen Anh Khoa',
      email: 'diwas118151@gmail.com',
      phone: '0899320427',
      password: 'Asdasd1',
      role: 'admin',
      gender: 'male',
    })

    // get ongoing tournaments
    const tournaments = await TournamentModel.find({ status: 'ongoing' }).lean()

    // return tournaments
    return NextResponse.json({ tournaments }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
