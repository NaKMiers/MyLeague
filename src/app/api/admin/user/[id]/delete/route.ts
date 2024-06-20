import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'
import TeamModel from '@/models/TeamModel'

// Models: User, Team
import '@/models/UserModel'
import '@/models/TeamModel'

// [DELETE]: /api/admin/user/:id/delete
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Delete User - ')

  try {
    // connect to database
    await connectDatabase()

    // check if user is currently a coach of a team
    const team = await TeamModel.findOne({ coach: id }).lean()
    if (team) {
      return NextResponse.json(
        { message: 'Người dùng hiện đang là HLV của một đội bóng' },
        { status: 400 }
      )
    }

    // delete user
    await UserModel.findByIdAndDelete(id)

    // return user
    return NextResponse.json({ message: 'Xóa người dùng thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
