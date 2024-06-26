'use client'

import { FieldValues, useForm } from 'react-hook-form'
import Input from './Input'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

interface SearchBarProps {
  className?: string
}

function SearchBar({ className = '' }: SearchBarProps) {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      search: '',
    },
  })

  return (
    <div className={`${className}`}>
      <Input
        id='search'
        label='Tìm kiếm...'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        icon={FaSearch}
        type='text'
        labelBg='bg-white'
        className='min-w-[40%] mt-3'
        onFocus={() => clearErrors('search')}
      />
    </div>
  )
}

export default SearchBar
