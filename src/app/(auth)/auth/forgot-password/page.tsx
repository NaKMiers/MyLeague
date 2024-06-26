'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import { forgotPasswordApi } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

const time = 60

function ForgotPasswordPage() {
  // states
  const [isSent, setIsSent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const [countDown, setCountDown] = useState<number>(time)

  useEffect(() => {
    if (isSent) {
      setIsCounting(true)
      const interval = setInterval(() => {
        if (countDown === 0) {
          // reset
          clearInterval(interval)
          setIsCounting(false)
          setIsSent(false)
          setCountDown(time)
          return
        }
        setCountDown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isSent, countDown])

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
    },
  })

  // MARK: Forgot Password Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      setIsLoading(true)
      try {
        // send request to server
        const { message } = await forgotPasswordApi(data)

        // show success message
        toast.success(message)

        // set is sent
        setIsSent(true)
      } catch (err: any) {
        // show error message
        console.log(err)
        const { message } = err
        setError('email', { type: 'manual', message: message })
        toast.error(message)
      } finally {
        // reset loading state
        setIsLoading(false)
      }
    },
    [setError]
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
          <h1 className='text-3xl font-bold text-center'>Quên mật khẩu</h1>
        </div>

        <Divider size={5} />

        <p className='mb-1.5 ml-2 font-body tracking-wider text-sm italic text-slate-700'>
          Hãy nhập email của bạn để khôi phục mật khẩu.
        </p>

        {isSent && isCounting ? (
          <div className='flex items-center gap-3 mb-3 '>
            <div className='flex items-center gap-2 border border-dark py-2 px-3 rounded-lg bg-white'>
              {countDown ? <FaCircleNotch size={20} className='text-dark animate-spin' /> : ''}
              <span className='text-dark text-nowrap'>{countDown > 0 ? countDown : 'Hết giờ'}</span>
            </div>

            <p className='text-[14px] italic text-slate-500 leading-5'>
              You will have received code in a minute, please wait!
            </p>
          </div>
        ) : (
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
        )}

        <div className='flex justify-end'>
          <Link
            href='/auth/login'
            className='block w-full text-right text-sm underline underline-offset-2 mt-2'
          >
            Quay lại đăng nhập
          </Link>
        </div>

        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSent && isCounting}
            className={`h-[42px] flex items-center justify-center border border-dark bg-dark-100 text-white rounded-3xl px-5 mt-5 font-bold text-lg hover:bg-white hover:text-dark trans-200 ${
              isLoading || isCounting ? 'bg-slate-200 pointer-events-none' : ''
            }`}
          >
            {isLoading || isCounting ? (
              <FaCircleNotch size={18} className='text-dark trans-200 animate-spin' />
            ) : (
              'Gửi mã'
            )}
          </button>
        </div>

        <Divider size={10} />
      </div>
    </div>
  )
}
export default ForgotPasswordPage
