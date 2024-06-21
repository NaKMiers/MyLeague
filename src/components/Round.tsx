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
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from './ConfirmDialog'
import Divider from './Divider'
import MatchCard from './MatchCard'
import MatchModal from './MatchModal'

interface RoundProps {
  round: IRound
  setRounds: Dispatch<SetStateAction<IRound[]>>
  className?: string
}

function Round({ round, setRounds, className = '' }: RoundProps) {
  // hook
  const params = useParams()
  const { id: tournamentId } = params

  // states
  const [matches, setMatches] = useState<IMatch[]>(round.matches ?? [])
  const [openMatchModal, setOpenMatchModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<string>('delete')
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      team1: '',
      team2: '',
      startedAt: '',
    },
  })

  // add match
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log('data: ', data)

      // start loading
      setIsLoading(true)

      try {
        data.tournamentId = tournamentId
        data.roundId = round._id

        console.log('data: ', data)

        if (data.team1 === data.team2) {
          throw new Error('Hai đội bóng không được trùng nhau')
        }

        const { match, message } = await addMatchApi(data)

        // update rounds
        setMatches(prev => [...prev, match])

        // show success
        toast.success(message)

        // close modal
        setOpenMatchModal(false)

        // reset form
        reset()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // end loading
        setIsLoading(false)
      }
    },
    [reset, round._id, tournamentId]
  )

  // handle delete round
  const handleDeleteRound = useCallback(async () => {
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
      setIsLoading(false)
      setIsOpenConfirmModal(false)
    }
  }, [setRounds, setIsLoading, tournamentId, round._id])

  return (
    <div className='bg-white rounded-lg shadow-md p-4'>
      <h2 className='flex items-center justify-center gap-2 text-slate-700 text-2xl w-full text-center font-semibold'>
        {round.name}{' '}
        <button
          className='rounded-lg border-2 px-1.5 py-0.5 text-sm hover:text-dark hover:border-dark trans-200'
          onClick={() => setOpenMatchModal(true)}
        >
          Thêm trận
        </button>
        {/* Delete Button */}
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
      </h2>
      <Divider border size={2} />
      <div className='flex flex-wrap md:flex-nowrap md:gap-4 justify-center md:justify-between'>
        <p className='text-slate-700 font-body tracking-wider'>
          Thời gian bắt đầu:{' '}
          <span className='text-green-500'>{moment(round.startedAt).format('LLLL')}</span>
        </p>

        <p className='text-slate-700 font-body tracking-wider'>
          Thời gian kết thúc:{' '}
          <span className='text-rose-500'>{moment(round.endedAt).format('LLLL')}</span>
        </p>
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

      {/* Add Match Modal */}
      <MatchModal
        title='Thêm trận'
        open={openMatchModal}
        setOpen={setOpenMatchModal}
        isLoading={isLoading}
        form={{ register, errors, setError, clearErrors }}
        onAccept={handleSubmit(onSubmit)}
      />

      <Divider size={4} />

      {/* Matches */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {matches.map(match => (
          <MatchCard match={match} setMatches={setMatches} key={match._id} />
        ))}
      </div>
    </div>
  )
}

export default Round
