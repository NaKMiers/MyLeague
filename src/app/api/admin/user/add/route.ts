import { connectDatabase } from '@/config/database'
import '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import UserModel from '@/models/UserModel'

// [POST]: /api/admin/user/add
export async function POST(req: NextRequest) {
  console.log(' - Create User - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from requests to create new user
    const { fullName, email, phone, password, role, gender } = await req.json()

    // create user
    const user = await UserModel.create({
      fullName,
      email,
      phone,
      password,
      role,
      gender,
    })

    // return user
    return NextResponse.json({ user, mesage: 'Thêm tài khoản thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
