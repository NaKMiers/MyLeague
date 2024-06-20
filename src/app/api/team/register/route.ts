import { connectDatabase } from '@/config/database'
import TeamModel from '@/models/TeamModel'
import TournamentModel, { ITournament } from '@/models/TournamentModel'
import UserModel, { IUser } from '@/models/UserModel'
import { generatePassword } from '@/utils/generate'
import { uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Team, Tournament
import '@/models/TeamModel'
import '@/models/TournamentModel'
import '@/models/UserModel'
import Kakao from 'next-auth/providers/kakao'

// [POST]: /api/team/register
export async function POST(req: NextRequest) {
  console.log('- Register Team - ')

  try {
    // connect to database
    await connectDatabase()

    // get data from request
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const {
      tournamentId,
      name,
      coach,
      email,
      phone,
      school,
      city,
      primaryColor,
      secondaryColor,
      number,
    } = data
    const players = JSON.parse(data.players as string)
    let teamLogo = formData.get('teamLogo')

    console.log('players: ', players)

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

    let user = await UserModel.findOne({ email: { $in: emails }, status: 'active' }).lean()
    if (user) {
      return NextResponse.json({ message: 'Email đã được đăng ký' }, { status: 400 })
    }

    // check if phone of coach and players are duplicated
    const phones = [phone, ...players.map((player: any) => player.phone)]
    if (new Set(phones).size !== phones.length) {
      return NextResponse.json({ message: 'Số điện thoại bị trùng' }, { status: 401 })
    }

    user = await UserModel.findOne({ phone: { $in: phones }, status: 'active' }).lean()
    if (user) {
      return NextResponse.json({ message: 'Số điện thoại đã được đăng ký' }, { status: 401 })
    }

    // check tournament if exists or not
    const tournament: ITournament | null = await TournamentModel.findById(tournamentId).lean()
    if (!tournament) {
      return NextResponse.json({ message: 'Không tìm thấy giải đấu' })
    }

    // check gender of players
    if (players.some((player: IUser) => player.gender !== tournament.gender)) {
      return NextResponse.json(
        {
          message: `Tất cả cầu thủ phải là ${tournament.gender === 'male' ? 'nam' : 'nữ'}`,
        },
        { status: 401 }
      )
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
      status: 'inactive',
    })
    console.log('newCoach: ', newCoach)

    // create players
    const newPlayers = players.map((player: any) => {
      return new UserModel({
        fullName: player.fullName,
        email: player.email,
        phone: player.phone,
        password: generatePassword(8),
        role: player.role,
        gender: player.gender,
        number: player.number,
        status: 'inactive',
      })
    })
    console.log('newPlayers: ', newPlayers)

    // create team
    const newTeam = new TeamModel({
      tournamentId,
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
