'use client'

import Divider from '@/components/Divider'
import TournamentCard from '@/components/TournamentCard'
import TournamentModal from '@/components/TournamentModal'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ITournament } from '@/models/TournamentModel'
import { addTournamentApi, getAllTournamentsApi } from '@/requests'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function ManageTournaments() {
  // hook
  const dispatch = useAppDispatch()

  // states
  const [tournaments, setTournaments] = useState<ITournament[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      type: 'Loại trực tiếp',
      startedAt: '',
      endedAt: '',
      gender: 'male',
      status: '',
      note: '',
    },
  })

  // get all tournaments
  useEffect(() => {
    const getTournaments = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { tournaments } = await getAllTournamentsApi()
        console.log('tournaments', tournaments)

        setTournaments(tournaments)
      } catch (err: any) {
        console.log(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    getTournaments()
  }, [dispatch])

  // validation
  const handleValidate: SubmitHandler<FieldValues> = useCallback(data => {
    let isValid = true

    return isValid
  }, [])

  // handle add
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate
      if (!handleValidate(data)) return

      // start loading
      setIsLoading(true)

      try {
        const { tournament, message } = await addTournamentApi(data)

        // update state
        setTournaments([...tournaments, tournament])

        // show success
        toast.success(message)

        // close modal
        setOpenModal(false)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [handleValidate, tournaments]
  )

  return (
    <div>
      <h1 className='text-4xl font-semibold text-slate-500 flex items-center gap-3'>
        Quản lý giải đấu{' '}
        <button
          className='border-2 rounded-md text-sky-400 border-sky-400 px-1.5 text-lg hover:bg-sky-400 hover:text-white trans-200'
          onClick={() => setOpenModal(true)}
        >
          Thêm
        </button>
      </h1>
      <Divider border size={4} />

      {tournaments.map(tournament => (
        <TournamentCard
          tournament={tournament}
          setTournaments={setTournaments}
          className='mb-6'
          key={tournament._id}
        />
      ))}

      {/* Add Tournament Modal */}
      <TournamentModal
        title='Thêm giải đấu'
        open={openModal}
        setOpen={setOpenModal}
        onAccept={handleSubmit(onSubmit)}
        form={{ register, errors, setError, clearErrors }}
      />
    </div>
  )
}

export default ManageTournaments
