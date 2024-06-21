import { IUser } from '@/models/UserModel'
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import ConfirmDialog from './ConfirmDialog'
import { RiDonutChartFill } from 'react-icons/ri'
import { FaRegTrashAlt } from 'react-icons/fa'
import { deleteUserApi, updateUserApi } from '@/requests'
import toast from 'react-hot-toast'
import UserModal from './UserModal'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

interface UserCardProps {
  user: IUser
  setUsers: Dispatch<SetStateAction<IUser[]>>
  className?: string
}

function UserCard({ user, setUsers, className = '' }: UserCardProps) {
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
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
    },
  })

  // handle delete user
  const handleDeleteUser = useCallback(async () => {
    setIsLoading(true)

    try {
      // delete user
      const { message } = await deleteUserApi(user._id)

      // update states
      setUsers(prev => prev.filter(item => item._id !== user._id))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
      setIsOpenConfirmModal(false)
    }
  }, [setUsers, user._id])

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
        const { user: u, message } = await updateUserApi(user._id, data)

        // update state
        setUsers(prev => prev.map(item => (item._id === u._id ? u : item)))

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
    [handleValidate, setUsers, user._id]
  )

  return (
    <div className={`flex items-start border-2 border-dark rounded-lg shadow-lg p-4 ${className}`}>
      <div className='w-[calc(100%_-_44px)]'>
        <h2 className='text-xl font-semibold text-dark'>Họ tên: {user.fullName}</h2>
        <p className='text-sm text-dark-300'>
          Email: <span className='font-semibold text-slate-600'>{user.email}</span>
        </p>
        <p className='text-sm text-dark-300'>
          Số điện thoại: <span className='font-semibold text-slate-600'>{user.phone}</span>
        </p>
        <p className='text-sm text-dark-300'>
          Password: <span className='font-semibold text-slate-600'>{user.password}</span>
        </p>
        {user.gender && (
          <p className='text-sm text-dark-300'>
            Giới tính:{' '}
            <span className='font-semibold text-slate-600'>{user.gender === 'male' ? 'Nam' : 'Nữ'}</span>
          </p>
        )}
        <p className='text-sm text-dark-300'>
          Chức vụ: <span className='font-semibold text-slate-600'>{user.role}</span>
        </p>
        {user.status === 'inactive' && (
          <p className='text-sm text-dark-300'>
            Trạng thái tài khoản: <span className='font-semibold text-slate-600'>{user.status}</span>
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col flex-shrink-0 border bg-white border-dark text-dark rounded-lg px-2 py-3 gap-4'>
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
        title={`Xóa người dùng`}
        content={`Bạn có chắc muốn xóa ${confirmType} người dùng này không?`}
        onAccept={handleDeleteUser}
        isLoading={isLoading}
        color={'rose'}
      />

      {/* Edit User Modal */}
      <UserModal
        title='Sửa thông tin người dùng'
        editMode
        open={isOpenEditModal}
        setOpen={setIsOpenEditModal}
        onAccept={handleSubmit(onSubmit)}
        form={{ register, errors, setError, clearErrors }}
      />
    </div>
  )
}

export default UserCard
