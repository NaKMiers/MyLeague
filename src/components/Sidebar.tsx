'use client'

import { getSession, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { TbChevronCompactRight } from 'react-icons/tb'
import Divider from './Divider'

interface SidebarProps {
  admin?: boolean
  className?: string
}

function Sidebar({ admin, className = '' }: SidebarProps) {
  // hooks

  // states
  const [curUser, setCurUser] = useState<any>(null)
  const [open, setOpen] = useState<boolean>(false)

  // MARK: Side Effects
  // update user session
  useEffect(() => {
    const getUser = async () => {
      const session = await getSession()
      const user: any = session?.user
      setCurUser(user)
    }

    if (!curUser?._id) {
      getUser()
    }
  }, [curUser?._id])

  return (
    <>
      {/* Pusher */}
      <div className={`${open ? 'md:mr-[300px]' : 'mr-[32px]'} trans-300`} />

      {/* Main Sidebar */}
      <div
        className={`fixed z-30 flex bg-dark-100 h-full trans-300 w-full md:max-w-[300px] ${
          !open ? '-translate-x-[calc(100%-32px)]' : ''
        } ${className}`}
      >
        <div className='flex flex-col p-21 w-full'>
          {/* Brand */}
          <div className='flex items-center gap-4 overflow-x-scroll no-scrollbar'>
            <Image
              className='aspect-square rounded-full shadow-lg'
              src='/images/logo.png'
              height={42}
              width={42}
              alt='logo'
            />

            <h1 className='text-white text-3xl font-semibold'>MyLeague</h1>
          </div>

          <Divider size={6} />

          {/* Navigation */}
          <ul className='flex flex-col gap-4 font-body tracking-wider'>
            <li>
              <a href='/' className='block text-white hover:text-secondary trans-200'>
                Trang chủ
              </a>
            </li>
            <li>
              <a href='/tournament' className='block text-white hover:text-secondary trans-200'>
                Giải đấu
              </a>
            </li>
            <li>
              <a href='/' className='block text-white hover:text-secondary trans-200'>
                Lịch thi đấu
              </a>
            </li>
            <li>
              <a href='/team/register' className='block text-white hover:text-secondary trans-200'>
                Đăng ký tham gia
              </a>
            </li>
            {curUser?.role === 'coach' && (
              <li>
                <a href='/team/my-team' className='block text-white hover:text-secondary trans-200'>
                  Đội bóng của tôi
                </a>
              </li>
            )}
          </ul>

          <Divider size={4} />

          {curUser?.role === 'admin' && (
            <ul className='flex flex-col gap-4 font-body tracking wider border-2 border-white p-2 rounded-lg'>
              <li>
                <a href='/admin/tournament' className='block text-white hover:text-secondary trans-200'>
                  Quản lí giải đấu
                </a>
              </li>
              <li>
                <a href='/admin/team' className='block text-white hover:text-secondary trans-200'>
                  Quản lí đăng ký đội bóng
                </a>
              </li>
              <li>
                <a href='/admin/user' className='block text-white hover:text-secondary trans-200'>
                  Quản lí người dùng
                </a>
              </li>
            </ul>
          )}

          {curUser && (
            <div className='flex-1 flex items-end'>
              <div className='flex justify-between items-center gap-3 w-full text-white'>
                <div className='flex items-center gap-4'>
                  <Image
                    className='aspect-square rounded-full shadow-lg'
                    src={curUser.avatar}
                    height={40}
                    width={40}
                    alt='avatar'
                  />
                  <span title={curUser.email} className='block text-ellipsis line-clamp-1 max-w-[100px]'>
                    {curUser.email}
                  </span>
                </div>

                <button
                  className='rounded-md border border-dark bg-yellow-300 hover:bg-yellow-400 trans-200 p-1.5 text-dark group'
                  onClick={() => signOut()}
                >
                  <FiLogOut size={20} className='wiggle' />
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className='flex items-center justify-center group flex-shrink-0'
          onClick={() => setOpen(prev => !prev)}
        >
          <TbChevronCompactRight
            className={`text-white group-hover:text-secondary trans-200 ${open ? 'rotate-180' : ''}`}
            size={32}
          />
        </button>
      </div>
    </>
  )
}

export default Sidebar
