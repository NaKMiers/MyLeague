'use client'

import Divider from '@/components/Divider'
import { ITeam } from '@/models/TeamModel'
import { IUser } from '@/models/UserModel'
import { getMyTeamsApi } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import './my-team.scss'

function MyTeamPage() {
  // states
  const [teams, setTeams] = useState<ITeam[]>([])

  // get my teams
  useEffect(() => {
    const getMyTeams = async () => {
      try {
        const { teams } = await getMyTeamsApi()

        setTeams(teams)
      } catch (err: any) {
        toast.error(err.message)
      }
    }
    getMyTeams()
  }, [])

  return (
    <div>
      <h1 className='text-4xl font-semibold text-slate-500'>Đội bóng của tôi</h1>
      <Divider border size={4} />

      {teams.map(team => (
        <Link
          href={`/team/${team._id}`}
          className='rounded-lg shadow-lg p-4 border-2 border-slate-300 grid sm:grid-cols-2 md:grid-cols-3 gap-21 mb-6'
          key={team._id}
        >
          {/* Action Buttons */}
          <div className='flex flex-col gap-2 text-slate-700'>
            <h2 className='text-xl font-semibold text-slate-500'>{team.name}</h2>
            <Image src={team.logo} width={150} height={150} alt='logo' className='rounded-lg' />
          </div>
          <div className='flex flex-col gap-2 text-slate-700'>
            <h2 className='text-xl font-semibold text-slate-500'>Số cầu thủ: {team.players.length}</h2>
            <p className='font-semibold'>Trường: {team.school}</p>
            <p className='font-semibold'>Thành phố: {team.city}</p>
            <p className='font-semibold'>Màu áo: {team.primaryColor}</p>
          </div>
          <div className='flex flex-col gap-2 text-slate-700'>
            <h2 className='text-xl font-semibold text-slate-500'>
              Email: <span className='text-dark'>{(team.coach as IUser).email}</span>
            </h2>
            <p className='font-semibold'>Số điện thoại: {(team.coach as IUser).phone}</p>
            <p className='font-semibold'>
              <span className='inline-block border rounded-md border-dark px-2'>
                Tình trạng:{' '}
                <span
                  className={`text-dark font-normal ${
                    team.status === 'active'
                      ? 'text-green-500'
                      : team.status === 'pending'
                      ? 'text-yellow-500'
                      : 'text-slate-500'
                  }`}
                >
                  {team.status === 'active'
                    ? 'Đã duyệt'
                    : team.status === 'pending'
                    ? 'Chờ duyệt'
                    : 'Từ chối'}
                </span>
              </span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default MyTeamPage
