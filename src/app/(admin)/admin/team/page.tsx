'use client'

import Divider from '@/components/Divider'
import TeamCard from '@/components/TeamCard'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ITeam } from '@/models/TeamModel'
import { getAllTeamsApi } from '@/requests'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function ManageTeams() {
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
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    getAllTeams()
  }, [dispatch])

  return (
    <div className='min-h-screen'>
      <h1 className='text-4xl font-semibold text-slate-500'>Quản lý đội bóng đăng ký</h1>
      <Divider border size={4} />

      {teams.map(team => (
        <TeamCard team={team} key={team._id} />
      ))}
    </div>
  )
}

export default ManageTeams
