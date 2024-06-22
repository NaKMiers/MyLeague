import { IRound } from '@/models/RoundModel'
import { addRoundApi, editRoundApi } from '@/requests/roundRequests'
import moment from 'moment'
import { useParams } from 'next/navigation'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import Divider from './Divider'
import Input from './Input'
import { ITeam } from '@/models/TeamModel'

interface RoundModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  round?: IRound
  setRounds: Dispatch<SetStateAction<IRound[]>>
  title: string
  isLoading?: boolean
  className?: string
}

function RoundModal({ open, setOpen, round, setRounds, title, className = '' }: RoundModalProps) {
  // hook
  const params = useParams()
  const { id: tournamentId } = params

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // ref
  const modalRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      name: round?.name || '',
      startedAt: round?.startedAt ? moment(round.startedAt).format('YYYY-MM-DDTHH:mm') : '',
      endedAt: round?.endedAt ? moment(round.endedAt).format('YYYY-MM-DDTHH:mm') : '',
      result: {
        winner: round?.result?.team || '',
        team: round?.result?.team || '',
        goal: round?.result?.goal || 0,
        fault: round?.result?.fault || 0,
        yellowCard: round?.result?.yellowCard || 0,
        redCard: round?.result?.redCard || 0,
        note: round?.result?.note || '',
      },
    },
  })

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

  // add round
  const onAddSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // start loading
      setIsLoading(true)

      try {
        const { round, message } = await addRoundApi(tournamentId as string, data)

        // update rounds
        setRounds(prev => [...prev, round])

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
    [reset, setOpen, setRounds, tournamentId]
  )

  // edit round
  const onEditSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (round) {
        // start loading
        setIsLoading(true)

        try {
          const { round: r, message } = await editRoundApi(tournamentId as string, round._id, data)

          // update rounds
          setRounds(prev => prev.map(item => (item._id === r._id ? r : item)))

          // show success
          toast.success(message)

          // close modal
          setOpen(false)

          // reset form
          reset({
            ...r,
            startedAt: moment(r.startedAt).format('YYYY-MM-DDTHH:mm'),
            endedAt: r.endedAt ? moment(r.endedAt).format('YYYY-MM-DDTHH:mm') : '',
          })
        } catch (err: any) {
          console.log(err)
          toast.error(err.message)
        } finally {
          // end loading
          setIsLoading(false)
        }
      }
    },
    [reset, setOpen, setRounds, tournamentId, round]
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
        className={`w-full ${
          round ? 'max-w-[800px] h-full' : 'max-w-[500px]'
        } max-h-[600px] overflow-auto rounded-medium shadow-medium p-21 bg-white`}
        ref={modalBodyRef}
        onClick={e => e.stopPropagation()}
      >
        <h2 className='text-slate-700 text-2xl w-full text-center font-semibold'>{title}</h2>
        <Divider border size={2} />
        <Divider size={2} />

        <Input
          id='name'
          label='Tên vòng'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => clearErrors('name')}
        />

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

        <Divider size={2} />

        {round && (
          <Input
            id='endedAt'
            label='Thời gian kết thúc'
            disabled={isLoading}
            register={register}
            errors={errors}
            type='datetime-local'
            labelBg='bg-white'
            className='min-w-[40%] mt-3'
            onFocus={() => clearErrors('endedAt')}
          />
        )}

        {round && (
          <div className='rounded-lg shadow-lg border p-2 w-full mt-5'>
            {/* <Input
              id='winner'
              label='Đội thắng'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              min={0}
              type='select'
              options={
                (round?.teams as ITeam[]).map(team => ({ value: team._id, label: team.name })) || []
              }
              labelBg='bg-white'
              className='min-w-[40%]'
              onFocus={() => clearErrors('winner')}
            /> */}
            <Input
              id='result.note'
              label='Ghi chú'
              disabled={isLoading}
              register={register}
              errors={errors}
              min={0}
              type='textarea'
              labelBg='bg-white'
              className='min-w-[40%] mt-5'
              onFocus={() => clearErrors('note')}
            />
          </div>
        )}

        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={() => (round ? handleSubmit(onEditSubmit)() : handleSubmit(onAddSubmit)())}
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

export default RoundModal
