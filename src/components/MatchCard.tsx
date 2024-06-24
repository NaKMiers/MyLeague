import { IMatch } from '@/models/MatchModel'
import { ITeam } from '@/models/TeamModel'
import { deleteMatchApi } from '@/requests'
import moment from 'moment'
import 'moment/locale/vi'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from './ConfirmDialog'
import Divider from './Divider'
import { FaPencil } from 'react-icons/fa6'
import MatchModal from './MatchModal'
import { IRound } from '@/models/RoundModel'

interface MatchCardProps {
  match: IMatch
  setMatches: Dispatch<SetStateAction<IMatch[]>>
  admin?: boolean
  round: IRound
  teams: ITeam[]
  className?: string
}

function MatchCard({ match, round, setMatches, teams, admin, className = '' }: MatchCardProps) {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<string>('delete')
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [openMatchModal, setOpenMatchModal] = useState<boolean>(false)

  // handle delete match
  const handleDeleteMatch = useCallback(async () => {
    setIsLoading(true)

    try {
      // delete match
      const { message } = await deleteMatchApi(match._id)

      // update states
      setMatches(prev => prev.filter(item => item._id !== match._id))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
      setIsOpenConfirmModal(false)
    }
  }, [setMatches, setIsLoading, match._id])

  return (
    <div className={`relative p-4 rounded-lg border shadow-lg overflow-auto ${className}`}>
      {/* Delete Button */}
      {admin && (
        <div className='flex items-center justify-center gap-2 absolute top-3 left-1/2 -translate-x-1/2'>
          <button
            className=' group'
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
          <button
            className=' group'
            disabled={isLoading}
            onClick={() => setOpenMatchModal(true)}
            title='Delete'
          >
            {isLoading ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaPencil size={18} className='wiggle text-yellow-500' />
            )}
          </button>
        </div>
      )}

      <div className='flex w-full justify-between items-center gap-3'>
        <div className='relative flex flex-col gap-2'>
          <Image
            className='aspect-square rounded-lg shadow-lg'
            src={(match.teams[0] as ITeam).logo}
            width={80}
            height={80}
            alt='logo'
          />
          {match.results[0]?.goal > match.results[1]?.goal && (
            <Image
              className='absolute -top-2 -right-2 rotate-45'
              src='/images/winner.png'
              width={30}
              height={30}
              alt='logo'
            />
          )}
          <p className='text-center font-semibold text-slate-700'>{(match.teams[0] as ITeam).name}</p>
        </div>

        <p className='flex items-center flex-nowrap gap-2 justify-center text-nowrap font-semibold'>
          {match.results[0]?.goal || '-'} : VS : {match.results[1]?.goal || '-'}
        </p>

        <div className='relative flex flex-col gap-2'>
          <Image
            className='aspect-square rounded-lg shadow-lg'
            src={(match.teams[1] as ITeam).logo}
            width={80}
            height={80}
            alt='logo'
          />
          {match.results[0]?.goal < match.results[1]?.goal && (
            <Image
              className='absolute -top-2 -right-2 rotate-45'
              src='/images/winner.png'
              width={30}
              height={30}
              alt='logo'
            />
          )}
          <p className='text-center font-semibold text-slate-700'>{(match.teams[1] as ITeam).name}</p>
        </div>
      </div>

      <Divider size={2} />

      <p className='text-slate-700 text-sm font-body tracking-wider text-center'>
        Thời gian bắt đầu:{' '}
        <span className='text-green-500'>{moment(match.startedAt).format('LLLL')}</span>
      </p>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title={`Xóa trận đấu`}
        content={`Bạn có chắc muốn xóa ${confirmType} trận đấu này không?`}
        onAccept={handleDeleteMatch}
        isLoading={isLoading}
        color={'rose'}
      />

      {/* Edit Match Modal */}
      <MatchModal
        title='Cập nhật trận đấu'
        open={openMatchModal}
        setOpen={setOpenMatchModal}
        setMatches={setMatches}
        round={round}
        match={match}
        teams={teams}
      />
    </div>
  )
}

export default MatchCard
