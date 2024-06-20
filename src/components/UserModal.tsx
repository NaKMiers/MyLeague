import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { FaCircleNotch } from 'react-icons/fa'
import Divider from './Divider'
import Input from './Input'

interface UserModalProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  editMode?: boolean
  title: string
  onAccept: () => void
  isLoading?: boolean
  form: any
  className?: string
}

function UserModal({
  open,
  setOpen,
  editMode,
  title,
  onAccept,
  isLoading,
  form,
  className = '',
}: UserModalProps) {
  // ref
  const modalRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

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
          onAccept()
          setOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen, onAccept, open])

  return (
    <div
      className={`fixed z-40 top-0 left-0 overflow-auto h-screen text-dark w-screen hidden items-center justify-center p-21 bg-black bg-opacity-50 opacity-0 trans-300 ${className}`}
      ref={modalRef}
      onClick={() => setOpen(false)}
    >
      <div
        className='w-full max-w-[500px] rounded-medium shadow-medium p-21 bg-white'
        ref={modalBodyRef}
        onClick={e => e.stopPropagation()}
      >
        <h2 className='text-slate-700 text-2xl w-full text-center font-semibold'>{title}</h2>
        <Divider border size={2} />
        <Divider size={2} />

        <Input
          id='fullName'
          label='Họ tên'
          disabled={isLoading}
          register={form.register}
          errors={form.errors}
          required
          type='text'
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => form.clearErrors('fullName')}
        />

        <Divider size={2} />

        <Input
          id='email'
          label='Email'
          disabled={isLoading}
          register={form.register}
          errors={form.errors}
          required
          type='email'
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => form.clearErrors('email')}
        />

        <Divider size={2} />

        <Input
          id='phone'
          label='Phone'
          disabled={isLoading}
          register={form.register}
          errors={form.errors}
          required
          type='number'
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => form.clearErrors('phone')}
        />

        <Divider size={2} />

        <Input
          id='gender'
          label='Giới tính'
          disabled={isLoading}
          register={form.register}
          errors={form.errors}
          required
          type='select'
          options={[
            {
              label: 'Nam',
              value: 'male',
              selected: true,
            },
            {
              label: 'Nữ',
              value: 'female',
            },
          ]}
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => form.clearErrors('gender')}
        />

        <Divider size={2} />

        <Input
          id='role'
          label='Chức vụ'
          disabled={isLoading}
          register={form.register}
          errors={form.errors}
          required
          type='select'
          options={[
            {
              label: 'Quản trị viên',
              value: 'admin',
            },
            {
              label: 'Huấn luyện viên',
              value: 'coach',
            },
            {
              label: 'Nhân viên',
              value: 'employee',
            },
          ]}
          labelBg='bg-white'
          className='min-w-[40%] mt-3'
          onFocus={() => form.clearErrors('role')}
        />

        <Divider size={2} />

        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={onAccept}
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

export default UserModal
