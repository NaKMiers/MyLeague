import { ITournament } from '@/models/TournamentModel'
import { deleteTournamentApi, updateTournamentApi } from '@/requests'
import moment from 'moment'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEye, FaRegTrashAlt } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from './ConfirmDialog'
import TournamentModal from './TournamentModal'
import Link from 'next/link'

interface TournamentCardProps {
  tournament: ITournament
  setTournaments: Dispatch<SetStateAction<ITournament[]>>
  className?: string
}

function TournamentCard({ tournament, setTournaments, className = '' }: TournamentCardProps) {
  // states
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
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      name: tournament.name,
      type: tournament.type,
      startedAt: moment(tournament.startedAt).format('YYYY-MM-DDTHH:mm'),
      endedAt: tournament.endedAt ? moment(tournament.endedAt).format('YYYY-MM-DDTHH:mm') : '',
      gender: tournament.gender,
      status: tournament.status,
      note: tournament.note,
    },
  })

  // handle delete tournament
  const handleDeleteTournament = useCallback(async () => {
    setIsLoading(true)

    try {
      // delete tournament
      const { message } = await deleteTournamentApi(tournament._id)

      // update states
      setTournaments(prev => prev.filter(item => item._id !== tournament._id))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err.message)
    } finally {
      setIsLoading(false)
      setIsOpenConfirmModal(false)
    }
  }, [setTournaments, tournament._id])

  // validation
  const handleValidate: SubmitHandler<FieldValues> = useCallback(data => {
    let isValid = true

    return isValid
  }, [])

  // handle edit
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate
      if (!handleValidate(data)) return

      // start loading
      setIsLoading(true)

      try {
        const { tournament: t, message } = await updateTournamentApi(tournament._id, data)

        // update state
        setTournaments(prev => prev.map(item => (item._id === t._id ? t : item)))

        // show success
        toast.success(message)

        // close modal
        setIsOpenEditModal(false)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [handleValidate, setTournaments, tournament._id]
  )

  return (
    <div
      className={`flex items-start gap-2 border-2 border-dark rounded-lg shadow-lg p-4 ${className}`}
      key={tournament._id}
    >
      <div className='flex flex-col gap-1 w-[calc(100%_-_44px)]'>
        <h2 className='text-xl font-semibold text-dark'>Giải đấu: {tournament.name}</h2>
        <p className='text-sm text-dark-300'>
          Thể lệ đấu: <span className='font-semibold text-slate-600'>{tournament.type}</span>
        </p>
        <p className='text-sm text-dark-300'>
          Giới tính:{' '}
          <span className='font-semibold text-slate-600'>
            {tournament.gender === 'male' ? 'Nam' : tournament.gender === 'female' ? 'Nữ' : 'Khác'}
          </span>
        </p>
        <p className='text-sm text-dark-300'>
          Bắt đầu:{' '}
          <span className='rounded-md px-1.5 border border-green-500 text-green-500'>
            {moment(tournament.startedAt).format('DD/MM/YYYY HH:mm')}
          </span>
        </p>
        <p className='text-sm text-dark-300'>
          Kết thúc:{' '}
          <span className='rounded-md px-1.5 border border-slate-500 text-slate-500'>
            {tournament.endedAt
              ? moment(tournament.endedAt).format('DD/MM/YYYY HH:mm')
              : 'Chưa kết thúc'}
          </span>
        </p>
        <p className='text-sm text-dark-300'>
          Trạng thái:{' '}
          <span
            className={`rounded-md px-1.5 border ${
              tournament.status === 'pending'
                ? 'text-yellow-500 border-yellow-500'
                : tournament.status === 'ongoing'
                ? 'text-green-500 border-green-500'
                : 'text-slate-500 border-slate-500'
            }`}
          >
            {tournament.status === 'pending'
              ? 'Đang chờ'
              : tournament.status === 'ongoing'
              ? 'Đang diễn ra'
              : 'Đã kết thúc'}
          </span>
        </p>
        <p className='text-sm text-dark-300'>
          Note: <span className='text-slate-600 text-base'>{tournament.note}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col flex-shrink-0 border bg-white border-dark text-dark rounded-lg px-2 py-3 gap-4'>
        <Link
          href={`/admin/tournament/${tournament._id}`}
          className='block group text-green-500'
          title='Edit'
        >
          <FaEye size={18} className='wiggle' />
        </Link>

        <button className='block group' onClick={() => setIsOpenEditModal(true)} title='Edit'>
          <MdEdit size={18} className='wiggle' />
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
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title={`Xóa giải đấu`}
        content={`Bạn có chắc muốn xóa ${confirmType} giải đấu này không?`}
        onAccept={handleDeleteTournament}
        isLoading={isLoading}
        color={'rose'}
      />

      {/* Edit Tournament Modal */}
      <TournamentModal
        title='Sửa giải đấu'
        editMode
        open={isOpenEditModal}
        setOpen={setIsOpenEditModal}
        onAccept={handleSubmit(onSubmit)}
        form={{ register, errors, setError, clearErrors }}
      />
    </div>
  )
}

export default TournamentCard
