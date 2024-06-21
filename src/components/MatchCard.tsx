import { IMatch } from '@/models/MatchModel'
import { ITeam } from '@/models/TeamModel'
import { deleteMatchApi } from '@/requests'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaRegTrashAlt } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from './ConfirmDialog'

interface MatchCardProps {
  match: IMatch
  setMatches: Dispatch<SetStateAction<IMatch[]>>
  className?: string
}

function MatchCard({ match, setMatches, className = '' }: MatchCardProps) {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<string>('delete')
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

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
    <div
      className={`relative flex items-center justify-between gap-4 p-4 rounded-lg border shadow-lg overflow-auto ${className}`}
    >
      <button
        className='absolute top-3 left-1/2 -translate-x-1/2 group'
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

      <div className='flex w-full justify-between items-center gap-3'>
        <div className='flex flex-col gap-2'>
          <Image
            className='aspect-square rounded-lg shadow-lg'
            src={(match.teams[0] as ITeam).logo}
            width={80}
            height={80}
            alt='logo'
          />
          <p className='text-center font-semibold text-slate-700'>{(match.teams[0] as ITeam).name}</p>
        </div>

        <p className='flex items-center flex-nowrap gap-2 justify-center'>
          <span>-</span>
          <span className='font-semibold'>: VS :</span>
          <span>-</span>
        </p>

        <div className='flex flex-col gap-2'>
          <Image
            className='aspect-square rounded-lg shadow-lg'
            src={(match.teams[1] as ITeam).logo}
            width={80}
            height={80}
            alt='logo'
          />
          <p className='text-center font-semibold text-slate-700'>{(match.teams[1] as ITeam).name}</p>
        </div>
      </div>

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
    </div>
  )
}

export default MatchCard
