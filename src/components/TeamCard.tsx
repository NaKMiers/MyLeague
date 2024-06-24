import { ITeam } from '@/models/TeamModel'
import { IUser } from '@/models/UserModel'
import { updateTeamStatusApi } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ConfirmDialog from './ConfirmDialog'

interface TeamCardProps {
  team: ITeam
  className?: string
}

function TeamCard({ team, className = '' }: TeamCardProps) {
  // states
  const [data, setData] = useState<ITeam>(team)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<'cancel' | 'accept'>('cancel')
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [value, setValue] = useState<boolean>(false)

  // handle update team status
  const handleUpdateTeamStatus = async () => {
    try {
      // update team status
      const { team } = await updateTeamStatusApi(data._id, value)
      setData(team)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }

  return (
    <>
      <Link
        href={`/team/${data._id}`}
        className={`relative rounded-lg overflow-auto shadow-lg p-4 border-2 border-slate-300 grid sm:grid-cols-2 md:grid-cols-3 gap-21 mb-6 ${className}`}
        key={data._id}
      >
        {/* Action Buttons */}
        <div className='absolute flex-col md:flex-row top-4 md:top-auto md:bottom-4 right-4 flex gap-2 font-body tracking-wide'>
          {data.status !== 'active' && (
            <button
              className='btn btn-sm btn-primary border border-dark px-1.5 rounded-[4px] bg-green-300 trans-200 hover:bg-opacity-50'
              onClick={e => {
                e.preventDefault()
                setConfirmType('accept')
                setValue(true)
                setIsOpenConfirmModal(true)
              }}
            >
              Chấp nhận
            </button>
          )}
          {data.status !== 'denied' && (
            <button
              className='btn btn-sm btn-primary border border-dark px-1.5 rounded-[4px] bg-slate-200 trans-200 hover:bg-opacity-50'
              onClick={e => {
                e.preventDefault()
                setConfirmType('cancel')
                setValue(false)
                setIsOpenConfirmModal(true)
              }}
            >
              Từ chối
            </button>
          )}
        </div>

        <div className='flex flex-col gap-2 text-slate-700'>
          <h2 className='text-xl font-semibold text-slate-500'>{data.name}</h2>
          <Image src={data.logo} width={150} height={150} alt='logo' className='rounded-lg' />
        </div>
        <div className='flex flex-col gap-2 text-slate-700'>
          <h2 className='text-xl font-semibold text-slate-500'>Số cầu thủ: {data.players.length}</h2>
          <p className='font-semibold'>Trường: {data.school}</p>
          <p className='font-semibold'>Thành phố: {data.city}</p>
          <p className='font-semibold'>Màu áo: {data.primaryColor}</p>
        </div>
        <div className='flex flex-col gap-2 text-slate-700'>
          <h2 className='text-xl font-semibold text-slate-500'>
            Email: <span className='text-dark'>{(data.coach as IUser).email}</span>
          </h2>
          <p className='font-semibold'>Huấn luyện viên: {(data.coach as IUser).fullName}</p>
          <p className='font-semibold'>Số điện thoại: {(data.coach as IUser).phone}</p>
          <p className='font-semibold'>
            <span className='inline-block border rounded-md border-dark px-2'>
              Tình trạng:{' '}
              <span
                className={`text-dark font-normal ${
                  data.status === 'active'
                    ? 'text-green-500'
                    : data.status === 'pending'
                    ? 'text-yellow-500'
                    : 'text-slate-500'
                }`}
              >
                {data.status === 'active'
                  ? 'Đã duyệt'
                  : data.status === 'pending'
                  ? 'Chờ duyệt'
                  : 'Từ chối'}
              </span>
            </span>
          </p>
        </div>
      </Link>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title={`${confirmType === 'cancel' ? 'Từ chối' : 'Xác nhận'} giải đấu`}
        content={`Bạn có chắc muốn ${
          confirmType === 'cancel' ? 'từ chối' : 'xác nhận'
        } giải đấu này không?`}
        onAccept={handleUpdateTeamStatus}
        isLoading={isLoading}
        color={confirmType === 'cancel' ? 'rose' : 'green'}
      />
    </>
  )
}

export default TeamCard
