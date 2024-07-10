'use client'

import { IMatch } from '@/models/MatchModel'
import { IRound } from '@/models/RoundModel'
import { addMatchApi } from '@/requests'
import { deleteRoundApi } from '@/requests/roundRequests'
import moment from 'moment'
import { useParams } from 'next/navigation'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FaPencil } from 'react-icons/fa6'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from './ConfirmDialog'
import Divider from './Divider'
import MatchCard from './MatchCard'
import MatchModal from './MatchModal'
import RoundModal from './RoundModal'
import { ITeam } from '@/models/TeamModel'

interface RoundCardProps {
  round: IRound
  setRounds?: Dispatch<SetStateAction<IRound[]>>
  teams: ITeam[]
  admin?: boolean
  className?: string
}

function RoundCard({ teams, round, setRounds, admin, className = '' }: RoundCardProps) {
  // hook
  const params = useParams()
  const { id: tournamentId } = params

  // states
  const [matches, setMatches] = useState<IMatch[]>(round.matches ?? [])
  const [openMatchModal, setOpenMatchModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<string>('delete')
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [openEditRoundModal, setOpenEditRoundModal] = useState<boolean>(false)

  // handle delete round
  const handleDeleteRound = useCallback(async () => {
    if (admin && setRounds) {
      // start loading
      setIsLoading(true)

      try {
        // delete v
        const { message } = await deleteRoundApi(tournamentId as string, round._id)

        // update states
        setRounds(prev => prev.filter(item => item._id !== round._id))

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading and close modal
        setIsLoading(false)
        setIsOpenConfirmModal(false)
      }
    }
  }, [setRounds, setIsLoading, tournamentId, round._id, admin])

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 pb-8 ${className}`}>
      <h2 className='flex items-center justify-center gap-2 text-slate-700 text-2xl w-full text-center font-semibold'>
        {round.name}{' '}
        {admin && (
          <button
            className='rounded-lg border-2 px-1.5 py-0.5 text-sm hover:text-dark hover:border-dark trans-200'
            onClick={() => setOpenMatchModal(true)}
          >
            Thêm trận
          </button>
        )}
        {/* Delete Button */}
        {admin && (
          <button
            className='block group'
            disabled={isLoading}
            onClick={() => {
              setConfirmType('delete')
              setIsOpenConfirmModal(true)
            }}
            title='Delete'
          >
            {isLoading ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaRegTrashAlt size={18} className='wiggle text-rose-500' />
            )}
          </button>
        )}
        {/* Edit Button */}
        {admin && (
          <button
            className='block group'
            disabled={isLoading}
            title='Delete'
            onClick={() => {
              setOpenEditRoundModal(true)
            }}
          >
            {isLoading ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaPencil size={18} className='wiggle text-yellow-500' />
            )}
          </button>
        )}
      </h2>
      <Divider border size={2} />
      <div className='flex flex-wrap md:flex-nowrap md:gap-4 justify-center md:justify-between'>
        <p className='text-slate-700 font-body tracking-wider'>
          Thời gian bắt đầu:{' '}
          <span className='text-green-500'>{moment(round.startedAt).format('LLLL')}</span>
        </p>

        {round.endedAt && (
          <p className='text-slate-700 font-body tracking-wider'>
            Thời gian kết thúc:{' '}
            <span className='text-rose-500'>{moment(round.endedAt).format('LLLL')}</span>
          </p>
        )}
      </div>
      <Divider border size={2} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title={`Xóa vòng`}
        content={`Bạn có chắc muốn xóa ${confirmType} vòng này không?`}
        onAccept={handleDeleteRound}
        isLoading={isLoading}
        color={'rose'}
      />

      {/* Edit Round Modal */}
      <RoundModal
        title='Cập nhật vòng đấu'
        open={openEditRoundModal}
        setOpen={setOpenEditRoundModal}
        setRounds={setRounds}
        round={round}
        teams={teams}
      />

      {/* Add Match Modal */}
      <MatchModal
        title='Thêm trận'
        open={openMatchModal}
        setOpen={setOpenMatchModal}
        setMatches={setMatches}
        round={round}
        teams={teams}
      />

      <Divider size={4} />

      {/* Matches */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {matches.map(match => (
          <MatchCard
            teams={teams}
            admin={admin}
            match={match}
            round={round}
            setMatches={setMatches}
            key={match._id}
          />
        ))}
      </div>

      {/* Final Result */}
      {round.result?.winner && (
        <div className='text-center flex flex-col border p-1 rounded-lg text-sm mt-4'>
          Đội thắng chung cuộc của vòng đấu:
          <span className={`text-md font-semibold text-green-500`}>
            {teams.find(team => team._id === round.result.winner)?.name}
          </span>
        </div>
      )}
    </div>
  )
}

export default RoundCard
