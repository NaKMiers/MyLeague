'use client'

import Divider from '@/components/Divider'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ITeam } from '@/models/TeamModel'
import { IUser } from '@/models/UserModel'
import { getAllTeamsApi } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function AdminTeamPage() {
  // hook
  const dispatch = useAppDispatch()

  // states
  const [teams, setTeams] = useState<ITeam[]>([])

  // get all teams
  useEffect(() => {
    const getAllTeams = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { teams } = await getAllTeamsApi()
        setTeams(teams)

        console.log('teams: ', teams)
      } catch (err: any) {
        console.log(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    getAllTeams()
  }, [dispatch])

  return (
    <div className='min-h-screen'>
      <h1 className='text-4xl font-semibold text-slate-500'>Quản lí đội bóng đăng ký</h1>
      <Divider border size={4} />

      {teams.map(team => (
        <Link
          href={`/team/${team._id}`}
          className='relative rounded-lg shadow-lg p-4 border-2 border-slate-300 grid sm:grid-cols-2 md:grid-cols-3 gap-21 mb-6'
          key={team._id}
        >
          {/* Action Buttons */}
          <div className='absolute flex-col md:flex-row top-4 md:top-auto md:bottom-4 right-4 flex gap-2 font-body tracking-wide'>
            <button
              className='btn btn-sm btn-primary border border-dark px-1.5 rounded-[4px] bg-green-400 trans-200 hover:bg-opacity-50'
              onClick={e => e.preventDefault()}
            >
              Chấp nhận
            </button>
            <button
              className='btn btn-sm btn-primary border border-dark px-1.5 rounded-[4px] bg-slate-300 trans-200 hover:bg-opacity-50'
              onClick={e => e.preventDefault()}
            >
              Từ chối
            </button>
          </div>

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
          </div>
        </Link>
      ))}
    </div>
  )
}

export default AdminTeamPage
