'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import { resetPasswordApi } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import './reset-password.scss'

function ResetPasswordPage() {
  // hooks
  const router = useRouter()
  const queryParams = useSearchParams()

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
      newPassword: '',
      reNewPassword: '',
    },
  })

  useEffect(() => {
    // MARK: Check if token is not provided
    if (!queryParams.get('token')) {
      toast.error('Không có token')
      router.push('/auth/login')
    }
  }, [queryParams, router])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true
      // password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(data.newPassword)) {
        setError('newPassword', {
          type: 'manual',
          message:
            'Mật khẩu mới phải có ít nhất 6 kí tự và bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số',
        })
        isValid = false
      }
      // check if new password and re-new password are match
      if (data.newPassword !== data.reNewPassword) {
        setError('reNewPassword', { type: 'manual', message: 'Mật khẩu không khớp' }) // add this line
        isValid = false
      }
      return isValid
    },
    [setError]
  )

  // MARK: Reset Password Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return
      // start loading
      setIsLoading(true)
      try {
        // get email and token from query
        const token = queryParams.get('token')
        // send request to server
        const { message } = await resetPasswordApi(token!, data.newPassword)
        // show success message
        toast.success(message)
        // redirect to login page
        router.push('/auth/login')
      } catch (err: any) {
        // show error message
        toast.error(err.message)
        console.log(err)
      } finally {
        // reset loading state
        setIsLoading(false)
      }
    },
    [handleValidate, queryParams, router]
  )

  // keyboard event
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleSubmit, onSubmit])

  return (
    <div className='w-screen min-h-screen flex items-center justify-center'>
      <div className='bg-white rounded-medium shadow-medium w-full max-w-[500px] p-21'>
        <div className='flex items-center justify-center gap-21'>
          <Image
            className='shadow-lg rounded-full aspect-square'
            src='/images/logo.png'
            width={50}
            height={50}
            alt='logo'
          />
          <h1 className='text-3xl font-bold text-center'>Khôi phục mật khẩu</h1>
        </div>

        <Divider size={5} />

        <Input
          id='newPassword'
          label='Mật khẩu mới'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          className='min-w-[40%]'
          onFocus={() => clearErrors('newPassword')}
        />

        <Input
          id='reNewPassword'
          label='Nhập lại mật khẩu'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          className='min-w-[40%] mt-6'
          onFocus={() => clearErrors('password')}
        />

        <Link
          href='/auth/login'
          className='block w-full text-right text-sm underline underline-offset-2 mt-2'
        >
          Quay lại đăng nhập?
        </Link>

        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`h-[42px] flex items-center justify-center border border-dark bg-dark-100 text-white rounded-3xl px-5 mt-5 font-bold text-lg hover:bg-white hover:text-dark trans-200 ${
              isLoading ? 'bg-slate-200 pointer-events-none' : ''
            }`}
          >
            {isLoading ? (
              <FaCircleNotch
                size={18}
                className='text-white group-hover:text-dark trans-200 animate-spin'
              />
            ) : (
              'Khôi phục'
            )}
          </button>
        </div>

        <Divider size={10} />
      </div>
    </div>
  )
}
export default ResetPasswordPage
