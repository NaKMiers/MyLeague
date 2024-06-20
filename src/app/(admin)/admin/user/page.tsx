'use client'

import Divider from '@/components/Divider'
import UserCard from '@/components/UserCard'
import UserModal from '@/components/UserModal'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { addUserApi, getAllUsersApi } from '@/requests'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function ManageUsers() {
  // hook
  const dispatch = useAppDispatch()

  // states
  const [users, setUsers] = useState<IUser[]>([])
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
      fullName: '',
      email: '',
      phone: '',
      gender: 'male',
      role: 'admin',
    },
  })

  // get all role user
  useEffect(() => {
    const getAllUsers = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { users } = await getAllUsersApi()
        setUsers(users)

        console.log('users: ', users)
      } catch (err: any) {
        console.log(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    getAllUsers()
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
        const { user, message } = await addUserApi(data)

        // update state
        setUsers([...users, user])

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
    [handleValidate, users]
  )

  return (
    <div className='min-h-screen'>
      <h1 className='text-4xl font-semibold text-slate-500 flex items-center gap-3'>
        Quản lý người dùng{' '}
        <button
          className='border-2 rounded-md text-sky-400 border-sky-400 px-1.5 text-lg hover:bg-sky-400 hover:text-white trans-200'
          onClick={() => setOpenModal(true)}
        >
          Thêm
        </button>
      </h1>
      <Divider border size={4} />

      <div className='grid md:grid-cols-2 gap-21'>
        {users.map(user => (
          <UserCard user={user} setUsers={setUsers} className='mb-6' key={user._id} />
        ))}
      </div>

      {/* Add Tournament Modal */}
      <UserModal
        title='Thêm người dùng'
        open={openModal}
        setOpen={setOpenModal}
        onAccept={handleSubmit(onSubmit)}
        form={{ register, errors, setError, clearErrors }}
      />
    </div>
  )
}

export default ManageUsers
