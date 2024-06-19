import React, { Dispatch, SetStateAction, use, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from './Input'
import Divider from './Divider'
import { FaTrash } from 'react-icons/fa'

interface PlayerFormProps {
  id: string
  index: number
  setPlayer: Dispatch<SetStateAction<any[]>>
  isSubmit: boolean
  className?: string
}

function PlayerForm({ id, index, setPlayer, isSubmit, className = '' }: PlayerFormProps) {
  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      role: '',
      number: '',
    },
  })

  useEffect(() => {
    setPlayer((prev: any) =>
      prev.map((player: any) => (player.id === id ? { ...player, ...watch() } : player))
    )
  }, [id, watch, setPlayer])

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (isSubmit) {
      handleSubmit(data => {
        setPlayer((prev: any) =>
          prev.map((player: any) => (player.id === id ? { ...player, ...data, isError: false } : player))
        )
      })()
    }
  }, [isSubmit, id, setPlayer, handleSubmit])

  return (
    <div className={`relative rounded-lg border-2 shadow-lg p-4 ${className}`}>
      <h3 className='text-slate-500 font-semibold'>Cầu thủ {index + 1}</h3>

      <button
        className='absolute top-4 right-4 group hover:text-rose-500 trans-200'
        onClick={() => setPlayer((prev: any) => prev.filter((player: any) => player.id !== id))}
      >
        <FaTrash size={18} className='wiggle' />
      </button>

      <Input
        id='fullName'
        label='Họ tên'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='text'
        labelBg='bg-white'
        className='min-w-[40%] mt-3'
        onFocus={() => clearErrors('fullName')}
      />

      <Divider size={2} />

      <Input
        id='email'
        label='Email'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='text'
        labelBg='bg-white'
        className='min-w-[40%] mt-3'
        onFocus={() => clearErrors('email')}
      />

      <Divider size={2} />

      <Input
        id='phone'
        label='Phone'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='number'
        labelBg='bg-white'
        className='min-w-[40%] mt-3'
        onFocus={() => clearErrors('phone')}
      />

      <Divider size={2} />

      <Input
        id='gender'
        label='Gender'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='select'
        options={[
          { label: 'Nam', value: 'male' },
          { label: 'Nữ', value: 'female' },
          { label: 'Khác', value: 'other' },
        ]}
        labelBg='bg-white'
        className='min-w-[40%] mt-3'
        onFocus={() => clearErrors('gender')}
      />

      <Divider size={2} />

      <Input
        id='role'
        label='Vài trò'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='select'
        options={[
          { label: 'Tiền đạo', value: 'striker' },
          { label: 'Trung vệ', value: 'centralDefender' },
          { label: 'Hậu vệ', value: 'defender' },
          { label: 'Thủ môn', value: 'goalie' },
          { label: 'Dự bị', value: 'reserve' },
        ]}
        labelBg='bg-white'
        className='min-w-[40%] mt-3'
        onFocus={() => clearErrors('role')}
      />

      <Divider size={2} />

      <Input
        id='number'
        label='Số áo'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type='number'
        min={1}
        max={99}
        labelBg='bg-white'
        className='min-w-[40%] mt-3'
        onFocus={() => clearErrors('number')}
      />

      <Divider size={2} />
    </div>
  )
}

export default PlayerForm
