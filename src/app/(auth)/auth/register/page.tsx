'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import { commonEmailMistakes } from '@/constants/mistakes'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

function RegisterPage() {
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
    shouldFocusError: false,
    defaultValues: {
      email: '',
      password: '',
      rePassword: '',
    },
  })

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // username must be at least 5 characters
      if (data.username.length < 5) {
        setError('username', {
          type: 'manual',
          message: 'Username phải có ít nhất 5 ký tự',
        })
        isValid = false
      }

      // email must be valid
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        setError('email', {
          type: 'manual',
          message: 'Email không hợp lệ',
        })
        isValid = false
      } else {
        const { email } = data
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

        if (!emailRegex.test(email)) {
          setError('email', { message: 'Email không hợp lệ' })
          isValid = false
        } else {
          if (commonEmailMistakes.some(mistake => email.toLowerCase().includes(mistake))) {
            setError('email', { message: 'Email không hợp lệ' })
            isValid = false
          }
        }
      }

      // password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(data.password)) {
        setError('password', {
          type: 'manual',
          message:
            'Mật khẩu phải có ít nhất 6 kí tự và bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Register Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(async data => {
    // // validate form
    // if (!handleValidate(data)) return
    // // start loading
    // setIsLoading(true)
    // try {
    //   // register logic here
    //   const { user, message } = await registerApi(data)
    //   // sign in user
    //   const callback = await signIn('credentials', {
    //     usernameOrEmail: user.username,
    //     password: data.password,
    //     redirect: false,
    //   })
    //   if (callback?.error) {
    //     toast.error(callback.error)
    //   } else {
    //     // show success message
    //     toast.success(message)
    //     // redirect to home page
    //     router.push('/')
    //   }
    // } catch (err: any) {
    //   // show error message
    //   console.log(err)
    //   toast.error(err.message)
    // } finally {
    //   // stop loading
    //   setIsLoading(false)
    // }
  }, [])

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
          <h1 className='text-3xl font-bold text-center'>Register</h1>
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
          type='text'
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => clearErrors('password')}
        />

        <Divider size={2} />

        <Input
          id='rePassword'
          label='Nhập lại mật khẩu'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => clearErrors('rePassword')}
        />

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
              'Đăng ký'
            )}
          </button>
        </div>

        <Divider size={10} />
      </div>
    </div>
  )
}
export default RegisterPage
