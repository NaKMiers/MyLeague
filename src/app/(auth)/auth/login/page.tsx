'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

function LoginPage() {
  // hooks
  const router = useRouter()

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
      email: '',
      password: '',
    },
  })

  // MARK: Login Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // start loading
      setIsLoading(true)

      try {
        // send request to server
        const res = await signIn('credentials', { ...data, redirect: false })

        if (res?.ok) {
          // show success message
          toast.success('Đăng nhập thành công!')

          // redirect to home page
          router.push('/')
        }

        if (res?.error) {
          // show error message
          toast.error(res.error)
          setError('email', { type: 'manual' })
          setError('password', { type: 'manual' })
        }
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop loading state
        setIsLoading(false)
      }
    },
    [setError, router]
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
          <Image className='shadow-lg' src='/images/logo.png' width={50} height={50} alt='logo' />
          <h1 className='text-3xl font-bold text-center'>Login</h1>
        </div>

        <Divider size={5} />

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
          id='password'
          label='Mật khẩu'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => clearErrors('password')}
        />

        <Link
          href='/auth/forgot-password'
          className='block w-full text-right text-sm underline underline-offset-2 mt-2'
        >
          Quên mật khẩu?
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
                className='text-slate-700 group-hover:text-dark trans-200 animate-spin'
              />
            ) : (
              'Đăng nhập'
            )}
          </button>
        </div>

        <Divider size={10} />
      </div>
    </div>
  )
}
export default LoginPage
