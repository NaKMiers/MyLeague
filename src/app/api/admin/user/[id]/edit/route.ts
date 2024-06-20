import { connectDatabase } from '@/config/database'
import '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import UserModel from '@/models/UserModel'

// [PUT]: /api/admin/user/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log(' - Create User - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from requests to edit user
    const { fullName, email, phone, password, role, gender } = await req.json()

    // update user
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: { fullName, email, phone, password, role, gender } },
      { new: true }
    )

    // check user
    if (!user) {
      return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 })
    }

    // return user
    return NextResponse.json({ user, message: 'Sửa thông tin người dùng thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
