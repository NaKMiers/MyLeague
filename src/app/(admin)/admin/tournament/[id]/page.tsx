'use client'
import Divider from '@/components/Divider'
import Round from '@/components/Round'
import RoundModal from '@/components/RoundModal'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IRound } from '@/models/RoundModel'
import { ITournament } from '@/models/TournamentModel'
import { getTournamentApi } from '@/requests'
import { addRoundApi } from '@/requests/roundRequests'
import moment from 'moment'
import 'moment/locale/vi'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function TournamentDetail({ params: { id } }: { params: { id: string } }) {
  // hook
  const dispatch = useAppDispatch()

  // states
  const [tournament, setTournament] = useState<ITournament | null>(null)
  const [rounds, setRounds] = useState<IRound[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openRoundModal, setOpenRoundModal] = useState<boolean>(false)

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
      name: '',
      startedAt: '',
    },
  })

  // get tournament
  useEffect(() => {
    const getTournament = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { tournament, rounds } = await getTournamentApi(id)
        setTournament(tournament)
        setRounds(rounds)

        console.log('tournament: ', tournament)
        console.log('rounds: ', rounds)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // end page loading
        dispatch(setPageLoading(false))
      }
    }

    getTournament()
  }, [dispatch, id])

  // add round
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log('data: ', data)

      // start loading
      setIsLoading(true)

      try {
        const { round, message } = await addRoundApi(id as string, data)

        // update rounds
        setRounds(prev => [...prev, round])

        // show success
        toast.success(message)

        // close modal
        setOpenRoundModal(false)

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
    [reset, id]
  )

  return (
    <div>
      {/* Tournament */}
      <h1 className='text-3xl font-semibold text-slate-500 flex items-center gap-3'>
        Giải đấu: <span className='text-slate-700'>{tournament?.name}</span>
      </h1>
      <Divider border size={4} />

      <div className=''>
        <p className='font-body text-slate-700 tracking-wider'>
          Thể lệ đấu: <span className='text-slate-600 font-semibold'>{tournament?.type}</span>
        </p>
        <p className='font-body text-slate-700 tracking-wider'>
          Số lượng đội: <span className='text-slate-600 font-semibold'>{tournament?.teamQuantity}</span>
        </p>
        <p className='font-body text-slate-700 tracking-wider'>
          Giới tính:{' '}
          <span className='text-slate-600 font-semibold'>
            {tournament?.gender === 'male' ? 'Nam' : 'Nữ'}
          </span>
        </p>
        <p className='font-body text-slate-700 tracking-wider'>
          Ngày bắt đầu:{' '}
          <span className='text-slate-600 font-semibold'>
            {tournament?.startedAt ? moment(tournament.startedAt).format('LLLL') : '-'}
          </span>
        </p>
      </div>

      <Divider size={12} />

      {/* Rounds */}
      <h1 className='text-3xl font-semibold text-slate-500 flex items-center gap-3'>
        Các vòng đấu
        <button
          className='rounded-lg border-2 px-2 py-1.5 text-sm hover:text-dark hover:border-dark trans-200'
          onClick={() => setOpenRoundModal(true)}
        >
          Thêm vòng
        </button>
      </h1>
      <Divider border size={4} />

      {/* Add Round Modal */}
      <RoundModal
        title='Thêm vòng đấu'
        open={openRoundModal}
        setOpen={setOpenRoundModal}
        isLoading={isLoading}
        form={{ register, errors, setError, clearErrors }}
        onAccept={handleSubmit(onSubmit)}
      />

      {/* Rounds */}
      <div className='grid grid-cols-1 gap-12'>
        {rounds.map(round => (
          <Round round={round} setRounds={setRounds} key={round._id} />
        ))}
      </div>
    </div>
  )
}

export default TournamentDetail