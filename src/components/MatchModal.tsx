import { ITeam } from '@/models/TeamModel'
import { addMatchApi, editMatchApi, getAllTeamsApi } from '@/requests'
import { useParams } from 'next/navigation'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { FaCircleNotch } from 'react-icons/fa'
import Divider from './Divider'
import Input from './Input'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { IRound } from '@/models/RoundModel'
import toast from 'react-hot-toast'
import { IMatch } from '@/models/MatchModel'
import moment from 'moment'

interface MatchModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setMatches: Dispatch<SetStateAction<IMatch[]>>
  round: IRound
  teams: ITeam[]
  match?: IMatch
  title: string
  className?: string
}

function MatchModal({
  open,
  setOpen,
  setMatches,
  round,
  match,
  title,
  teams,
  className = '',
}: MatchModalProps) {
  // hook
  const params = useParams()
  const { id: tournamentId } = params

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // ref
  const modalRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

  // show/hide modal
  useEffect(() => {
    if (open) {
      // show modal
      modalRef.current?.classList.remove('hidden')
      modalRef.current?.classList.add('flex')

      setTimeout(() => {
        // fade in modal
        modalRef.current?.classList.remove('opacity-0')

        // float in modal body
        modalBodyRef.current?.classList.remove('opacity-0')
        modalBodyRef.current?.classList.remove('translate-y-8')
      }, 1)
    } else {
      // fade out modal
      modalRef.current?.classList.add('opacity-0')

      // float out modal body
      modalBodyRef.current?.classList.add('opacity-0')
      modalBodyRef.current?.classList.add('translate-y-8')

      setTimeout(() => {
        // hide modal
        modalRef.current?.classList.add('hidden')
        modalRef.current?.classList.remove('flex')
      }, 350)
    }
  }, [open])

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      team1: (match?.teams[0] as ITeam)?._id || '',
      team2: (match?.teams[1] as ITeam)?._id || '',
      startedAt: moment(match?.startedAt || new Date()).format('YYYY-MM-DDTHH:mm'),
      status: match?.status || 'waiting',
      results: [
        {
          teamId: (match?.teams[0] as ITeam)?._id || '',
          goal: match?.results[0]?.goal || 0,
          score: match?.results[0]?.score || 0,
          fault: match?.results[0]?.fault || 0,
          yellowCard: match?.results[0]?.yellowCard || 0,
          redCard: match?.results[0]?.redCard || 0,
          note: match?.results[0]?.note || '',
        },
        {
          teamId: (match?.teams[1] as ITeam)?._id || '',
          goal: match?.results[1]?.goal || 0,
          score: match?.results[1]?.score || 0,
          fault: match?.results[1]?.fault || 0,
          yellowCard: match?.results[1]?.yellowCard || 0,
          redCard: match?.results[1]?.redCard || 0,
          note: match?.results[1]?.note || '',
        },
      ],
    },
  })

  // add match
  const onAddSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // start loading
      setIsLoading(true)

      try {
        data.tournamentId = tournamentId
        data.roundId = round._id

        if (data.team1 === data.team2) {
          throw new Error('Hai đội bóng không được trùng nhau')
        }

        const { match, message } = await addMatchApi(data)

        // update rounds
        setMatches(prev => [...prev, match])

        // show success
        toast.success(message)

        // close modal
        setOpen(false)

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
    [reset, setOpen, setMatches, round._id, tournamentId]
  )

  // edit match
  const onEditSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!match) return

      // start loading
      setIsLoading(true)

      try {
        data.tournamentId = tournamentId
        data.roundId = round._id

        if (data.team1 === data.team2) {
          throw new Error('Hai đội bóng không được trùng nhau')
        }

        const { match: m, message } = await editMatchApi(match._id, data)

        // update rounds
        setMatches(prev => prev.map(item => (item._id === m._id ? m : item)))

        // show success
        toast.success(message)

        // close modal
        setOpen(false)

        // reset form
        reset({
          ...m,
          startedAt: m.startedAt ? moment(m.startedAt).format('YYYY-MM-DDTHH:mm') : '',
        })
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // end loading
        setIsLoading(false)
      }
    },
    [reset, setOpen, setMatches, match, round._id, tournamentId]
  )

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open) {
        // ESC
        if (e.key === 'Escape') {
          setOpen(false)
        }

        // Enter
        if (e.key === 'Enter') {
          handleSubmit(onAddSubmit)()
          setOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen, handleSubmit, onAddSubmit, open])

  return (
    <div
      className={`fixed z-40 top-0 left-0 overflow-auto h-screen text-dark w-screen hidden items-center justify-center p-21 bg-black bg-opacity-50 opacity-0 trans-300 ${className}`}
      ref={modalRef}
      onClick={() => setOpen(false)}
    >
      <div
        className={`${
          match ? 'max-w-[800px]' : 'max-w-[600px]'
        } max-h-[675px] w-full rounded-medium shadow-medium overflow-auto p-21 bg-white`}
        ref={modalBodyRef}
        onClick={e => e.stopPropagation()}
      >
        <h2 className='text-slate-700 text-2xl w-full text-center font-semibold'>{title}</h2>
        <Divider border size={2} />
        <Divider size={2} />

        <div className='flex gap-2 justify-between items-center'>
          <Input
            id='team1'
            label='Đội 1'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='select'
            options={[
              { value: '', label: 'Chọn đội' },
              ...teams.map(team => ({ value: team._id, label: team.name })),
            ]}
            labelBg='bg-white'
            className='w-full'
            onFocus={() => clearErrors('team1')}
          />
          <Input
            id='team2'
            label='Đội 2'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='select'
            options={[
              { value: '', label: 'Chọn đội' },
              ...teams.map(team => ({ value: team._id, label: team.name })),
            ]}
            labelBg='bg-white'
            className='w-full'
            onFocus={() => clearErrors('team2')}
          />
        </div>

        <Divider size={2} />

        <Input
          id='startedAt'
          label='Thời gian bắt đầu'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='datetime-local'
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => clearErrors('startedAt')}
        />

        {match && (
          <Input
            id='status'
            label='Trạng thái'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='select'
            options={[
              { value: 'waiting', label: 'Chờ' },
              { value: 'playing', label: 'Đang diễn ra' },
              { value: 'finished', label: 'Kết thúc' },
            ]}
            labelBg='bg-white'
            className='min-w-[40%] mt-5'
            onFocus={() => clearErrors('status')}
          />
        )}

        {match && (
          <div className='flex gap-2 mt-5'>
            {/* Team 1 */}
            <div className='border p-2 rounded-lg shadow-lg w-full'>
              <h3 className='text-center mb-3'>
                Team:{' '}
                <span className='font-semibold text-slate-500'>
                  {teams.find(team => team._id === getValues('results')[0].teamId)?.name}
                </span>
              </h3>
              <Input
                id='results[0].goal'
                label='Số bàn thắng'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='number'
                labelBg='bg-white'
                className='min-w-[40%] mt-3'
                onFocus={() => clearErrors('results[0].goal')}
              />
              <Input
                id='results[0].fault'
                label='Lỗi'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='number'
                labelBg='bg-white'
                className='min-w-[40%] mt-3'
                onFocus={() => clearErrors('results[0].fault')}
              />
              <Input
                id='results[0].yellowCard'
                label='Số thẻ vàng'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='number'
                labelBg='bg-white'
                className='min-w-[40%] mt-3'
                onFocus={() => clearErrors('results[0].yellowCard')}
              />
              <Input
                id='results[0].redCard'
                label='Số thẻ đỏ'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='number'
                labelBg='bg-white'
                className='min-w-[40%] mt-3'
                onFocus={() => clearErrors('results[0].redCard')}
              />
            </div>

            {/* Team 2 */}
            <div className='border p-2 rounded-lg shadow-lg w-full'>
              <h3 className='text-center mb-3'>
                Team:{' '}
                <span className='font-semibold text-slate-500'>
                  {teams.find(team => team._id === getValues('results')[1].teamId)?.name}
                </span>
              </h3>
              <Input
                id='results[1].goal'
                label='Số bàn thắng'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='number'
                labelBg='bg-white'
                className='min-w-[40%] mt-3'
                onFocus={() => clearErrors('results[1].goal')}
              />
              <Input
                id='results[1].fault'
                label='Lỗi'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='number'
                labelBg='bg-white'
                className='min-w-[40%] mt-3'
                onFocus={() => clearErrors('results[1].fault')}
              />
              <Input
                id='results[1].yellowCard'
                label='Số thẻ vàng'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='number'
                labelBg='bg-white'
                className='min-w-[40%] mt-3'
                onFocus={() => clearErrors('results[1].yellowCard')}
              />
              <Input
                id='results[1].redCard'
                label='Số thẻ đỏ'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='number'
                labelBg='bg-white'
                className='min-w-[40%] mt-3'
                onFocus={() => clearErrors('results[1].redCard')}
              />
            </div>
          </div>
        )}

        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={() => (match ? handleSubmit(onEditSubmit)() : handleSubmit(onAddSubmit)())}
            disabled={isLoading}
            className={`h-[42px] flex items-center justify-center border border-dark bg-dark-100 text-white rounded-3xl px-5 mt-5 font-bold text-lg hover:bg-white hover:text-dark trans-200 ${
              isLoading ? 'bg-slate-200 pointer-events-none' : ''
            }`}
          >
            {isLoading ? (
              <FaCircleNotch
                size={18}
                className='text-slate-700 group-hover:text-dark trans-200 animate-spin'
              />
            ) : (
              'Gửi'
            )}
          </button>
        </div>

        <Divider size={4} />
      </div>
    </div>
  )
}

export default MatchModal
