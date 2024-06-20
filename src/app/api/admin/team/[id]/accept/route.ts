import { connectDatabase } from '@/config/database'
import { NextRequest, NextResponse } from 'next/server'

// Models: Team
import '@/models/TeamModel'
import TeamModel, { ITeam } from '@/models/TeamModel'
import UserModel from '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [PATCH]: /api/admin/team/:id/accept
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get All Teams - ')

  try {
    // connect to database
    await connectDatabase()

    // get value
    const { value } = await req.json()

    // update team status
    const team: ITeam | null = await TeamModel.findByIdAndUpdate(
      id,
      { $set: { status: value ? 'active' : 'denied' } },
      { new: true }
    )
      .populate('coach')
      .lean()

    // check team
    if (!team) {
      return NextResponse.json({ message: 'Không tìm thấy đội' }, { status: 404 })
    }

    // change status of coach and players in team
    if (value) {
      // update coach status
      await Promise.all([
        await UserModel.findByIdAndUpdate(team.coach, { $set: { status: 'active' } }),
        await UserModel.updateMany({ _id: { $in: team.players } }, { $set: { status: 'active' } }),
      ])
    } else {
      // update coach status
      await Promise.all([
        await UserModel.findByIdAndUpdate(team.coach, { $set: { status: 'inactive' } }),
        await UserModel.updateMany({ _id: { $in: team.players } }, { $set: { status: 'inactive' } }),
      ])
    }

    // return team
    return NextResponse.json({ team }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
