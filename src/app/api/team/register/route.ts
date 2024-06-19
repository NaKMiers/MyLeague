import { connectDatabase } from '@/config/database'
import TeamModel from '@/models/TeamModel'
import UserModel from '@/models/UserModel'
import { generatePassword } from '@/utils/generate'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Team
import '@/models/UserModel'
import '@/models/TeamModel'
import { uploadFile } from '@/utils/uploadFile'

// [POST]: /api/team/register
export async function POST(req: NextRequest) {
  console.log('- Register Team - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from request

    // get data to create course
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { name, coach, email, phone, school, city, primaryColor, secondaryColor, number } = data
    const players = JSON.parse(data.players as string)
    let teamLogo = formData.get('teamLogo')

    // check avatar
    if (!teamLogo) {
      return NextResponse.json({ message: 'Thiếu logo đội' }, { status: 400 })
    }

    // validate data
    // check if email of coach and players are duplicated
    const emails = [email, ...players.map((player: any) => player.email)]
    if (new Set(emails).size !== emails.length) {
      return NextResponse.json({ message: 'Email bị trùng' }, { status: 400 })
    }

    // check if phone of coach and players are duplicated
    const phones = [phone, ...players.map((player: any) => player.phone)]
    if (new Set(phones).size !== phones.length) {
      return NextResponse.json({ message: 'Số điện thoại bị trùng' }, { status: 400 })
    }

    // upload avatar and get imageUrl from AWS S3 Bucket
    const teamLogoUrl = await uploadFile(teamLogo, '1:1')

    // create coach
    const newCoach = new UserModel({
      fullName: coach,
      email,
      phone,
      role: 'coach',
      password: generatePassword(8),
    })
    console.log('newCoach: ', newCoach)

    // create players
    const newPlayers = players.map((player: any) => {
      return new UserModel({
        fullName: player.fullName,
        email: player.email,
        phone: player.phone,
        role: player.role,
        password: generatePassword(8),
        number: player.number,
      })
    })
    console.log('newPlayers: ', newPlayers)

    // create team
    const newTeam = new TeamModel({
      name,
      coach: newCoach._id,
      logo: teamLogoUrl,
      school,
      city,
      primaryColor,
      secondaryColor,
      players: newPlayers.map((player: any) => player._id),
    })
    console.log('newTeam: ', newTeam)

    // save all users
    await UserModel.insertMany([newCoach, ...newPlayers])
    await newTeam.save()

    return NextResponse.json({ message: 'Gửi đơn đăng ký thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
