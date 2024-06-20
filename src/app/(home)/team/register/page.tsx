'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import PlayerForm from '@/components/PlayerForm'
import TeamLogo from '@/components/TeamLogo'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ITournament } from '@/models/TournamentModel'
import { registerTeamApi } from '@/requests'
import { getOngoingTournamentsApi } from '@/requests'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function TeamRegister() {
  // hook
  const dispatch = useAppDispatch()
  const isPageLoading = useAppSelector(state => state.modal.isPageLoading)

  // states
  const [tournaments, setTournaments] = useState<ITournament[]>([])
  const [imageUrl, setImageUrl] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [isChangingTeamLogo, setIsChangingTeamLogo] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [players, setPlayers] = useState<any[]>([])
  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      tournamentId: '',
      name: '',
      coach: '',
      email: '',
      phone: '',
      school: '',
      city: '',
      primaryColor: 'Trắng',
      secondaryColor: 'Đen',
    },
  })

  // get tournaments to select
  useEffect(() => {
    const getTournaments = async () => {
      try {
        const { tournaments } = await getOngoingTournamentsApi()

        // update states
        setTournaments(tournaments)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getTournaments()
  }, [])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // coach email and players email must be unique
      const emails = [data.email, ...players.map(player => player.email)]
      if (new Set(emails).size !== emails.length) {
        toast.error('Email bị trùng')
        isValid = false
      }

      // coach phone and players phone must be unique
      const phones = [data.phone, ...players.map(player => player.phone)]
      if (new Set(phones).size !== phones.length) {
        toast.error('Số điện thoại bị trùng')
        isValid = false
      }

      return isValid
    },
    [players]
  )

  // MARK: Login Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!handleValidate(data)) {
        setIsSubmit(false)
        return
      }

      // start page loading
      dispatch(setPageLoading(true))

      try {
        const formData = new FormData()
        formData.append('tournamentId', data.tournamentId)
        formData.append('name', data.name)
        formData.append('coach', data.coach)
        formData.append('email', data.email)
        formData.append('phone', data.phone)
        formData.append('school', data.school)
        formData.append('city', data.city)
        formData.append('primaryColor', data.primaryColor)
        formData.append('secondaryColor', data.secondaryColor)
        formData.append('players', JSON.stringify(players))

        if (file) {
          formData.append('teamLogo', file)
        }

        // send request to server
        const { message } = await registerTeamApi(formData)

        // reset
        reset()
        setPlayers([])

        // show success
        toast.success(message)
      } catch (err: any) {
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    },
    [handleValidate, dispatch, reset, players, file]
  )

  useEffect(() => {
    if (isSubmit && !isPageLoading && players.length && !players.some(player => player.isError)) {
      handleSubmit(onSubmit)()
      setIsSubmit(false)
    }
  }, [handleSubmit, isSubmit, isPageLoading, onSubmit, players])

  return (
    <div className='w-full'>
      <h1 className='text-4xl font-semibold text-slate-500'>Đăng ký đội bóng</h1>
      <Divider border size={4} />

      {/* Team Info */}
      <section className='flex flex-col items-start md:flex-row gap-21'>
        <div
          className={`flex items-center justify-center aspect-square overflow-hidden rounded-lg shadow-lg max-w-[250px] group relative w-full border-2 border-white`}
        >
          <TeamLogo
            imageUrl={imageUrl}
            file={file}
            setFile={setFile}
            setImageUrl={setImageUrl}
            isChangingTeamLogo={isChangingTeamLogo}
            setChangingTeamLogo={setIsChangingTeamLogo}
            className='max-w-[250px]'
          />
        </div>

        <div className='flex-1 gap-21 grid md:grid-cols-2'>
          <div className='col-span-2'>
            <Input
              id='tournamentId'
              label='Chọn giải đấu'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='select'
              options={tournaments.map(tournament => ({
                value: tournament._id,
                label: tournament.name,
              }))}
              labelBg='bg-white'
              onFocus={() => clearErrors('tournamentId')}
            />
          </div>

          <div>
            <Input
              id='name'
              label='Tên đội bóng'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              labelBg='bg-white'
              onFocus={() => clearErrors('name')}
            />
          </div>

          <div>
            <Input
              id='coach'
              label='Tên huấn luyện viên'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              labelBg='bg-white'
              onFocus={() => clearErrors('coach')}
            />
          </div>

          <div>
            <Input
              id='email'
              label='Email'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='email'
              labelBg='bg-white'
              onFocus={() => clearErrors('email')}
            />
          </div>

          <div>
            <Input
              id='phone'
              label='Số điện thoại'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              labelBg='bg-white'
              onFocus={() => clearErrors('phone')}
            />
          </div>

          <div>
            <Input
              id='school'
              label='Tên trường'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              labelBg='bg-white'
              onFocus={() => clearErrors('school')}
            />
          </div>

          <div>
            <Input
              id='city'
              label='Tỉnh/Thành phố'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              labelBg='bg-white'
              onFocus={() => clearErrors('name')}
            />
          </div>

          <div>
            <Input
              id='primaryColor'
              label='Màu áo chính'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='select'
              labelBg='bg-white'
              onFocus={() => clearErrors('primaryColor')}
              options={[
                { value: 'Trắng', label: 'Trắng' },
                { value: 'Đỏ', label: 'Đỏ' },
                { value: 'Xanh', label: 'Xanh' },
                { value: 'Vàng', label: 'Vàng' },
                { value: 'Lục', label: 'Lục' },
                { value: 'Đen', label: 'Đen' },
              ]}
            />
          </div>

          <div>
            <Input
              id='secondaryColor'
              label='Màu áo phụ'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='select'
              labelBg='bg-white'
              onFocus={() => clearErrors('secondaryColor')}
              options={[
                { value: 'Đen', label: 'Đen' },
                { value: 'Đỏ', label: 'Đỏ' },
                { value: 'Xanh', label: 'Xanh' },
                { value: 'Vàng', label: 'Vàng' },
                { value: 'Lục', label: 'Lục' },
                { value: 'Trắng', label: 'Trắng' },
              ]}
            />
          </div>
        </div>
      </section>

      <Divider size={8} />

      <h1 className='text-4xl font-semibold text-slate-500 flex items-center gap-3'>
        <span>Đăng ký cầu thủ</span>
        <button
          className='rounded-lg border-2 p-2 text-sm hover:text-dark hover:border-dark trans-200'
          onClick={() =>
            players.length <= 15
              ? setPlayers(prev => [
                  ...prev,
                  {
                    id: new Date().getTime(),
                    isError: true,
                  },
                ])
              : toast.error('Số lượng cầu thủ không được vượt quá 11')
          }
        >
          Thêm
        </button>
      </h1>

      <Divider border size={4} />

      {/* Players */}
      <section>
        <div className='grid md:grid-cols-2 gap-21'>
          {players.map((player, index) => (
            <div key={player.id}>
              <PlayerForm isSubmit={isSubmit} setPlayer={setPlayers} id={player.id} index={index} />
            </div>
          ))}
        </div>
      </section>

      <Divider size={4} />

      {/* Submit Button */}
      <div className='flex justify-center'>
        <button
          className='rounded-lg border-2 border-dark p-2 shadow-lg hover:text-white hover:bg-dark-0 trans-200 font-semibold'
          onClick={() => {
            if (file) {
              if (players.length) {
                setIsSubmit(true)
              } else {
                toast.error('Vui lòng thêm cầu thủ')
              }
            } else {
              toast.error('Vui lòng thêm logo đội bóng')
            }
          }}
        >
          Đăng ký
        </button>
      </div>
    </div>
  )
}

export default TeamRegister
