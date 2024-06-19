'use client'

import Image from 'next/image'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCamera, FaSave } from 'react-icons/fa'
import { ImCancelCircle } from 'react-icons/im'

interface TeamLogoProps {
  imageUrl?: string
  file: File | null
  isChangingTeamLogo?: boolean
  setImageUrl: Dispatch<SetStateAction<string>>
  setFile: Dispatch<SetStateAction<File | null>>
  setChangingTeamLogo: Dispatch<SetStateAction<boolean>>
  className?: string
}

function TeamLogo({
  imageUrl,
  isChangingTeamLogo,
  setImageUrl,
  setFile,
  className = '',
}: TeamLogoProps) {
  // hook

  // refs
  const teamLogoInputRef = useRef<HTMLInputElement>(null)

  // handle add files when user select files
  const handleAddFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]

        // validate file type and size
        if (!file.type.startsWith('image/')) {
          return toast.error('Please select an image file')
        }
        if (file.size > 3 * 1024 * 1024) {
          return toast.error('Please select an image file less than 3MB')
        }

        setFile(file)
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl)
        }
        setImageUrl(URL.createObjectURL(file))

        e.target.value = ''
        e.target.files = null
      }
    },
    [imageUrl, setFile, setImageUrl]
  )

  // cancel changing teamLogo
  const handleCancelTeamLogo = useCallback(async () => {
    if (imageUrl) {
      setFile(null)
      setImageUrl('')

      URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl, setImageUrl, setFile])

  // revoke blob url when component unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  return (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={250}
          height={250}
          className='object-cover h-full w-full'
          alt='teamLogo'
        />
      ) : (
        <span className='font-semibold text-4xl text-slate-200'>Logo</span>
      )}

      <input
        id='images'
        hidden
        placeholder=' '
        disabled={isChangingTeamLogo}
        type='file'
        onChange={handleAddFile}
        ref={teamLogoInputRef}
      />
      {!isChangingTeamLogo && (
        <div
          className='absolute top-0 left-0 flex opacity-0 group-hover:opacity-100 items-center justify-center bg-dark-0 w-full h-full bg-opacity-20 trans-200 cursor-pointer drop-shadow-lg'
          onClick={() => !imageUrl && teamLogoInputRef.current?.click()}
        >
          {imageUrl ? (
            <div className='flex items-center justify-center gap-21'>
              <ImCancelCircle
                size={40}
                className='text-slate-200 wiggle-1'
                onClick={handleCancelTeamLogo}
              />
            </div>
          ) : (
            <FaCamera size={52} className='text-white wiggle-0' />
          )}
        </div>
      )}
      {isChangingTeamLogo && (
        <div className='absolute top-0 left-0 w-full h-full bg-white bg-opacity-20'>
          <Image
            className='animate-spin'
            src='/images/loading.png'
            width={200}
            height={200}
            alt='loading'
          />
        </div>
      )}
    </>
  )
}

export default TeamLogo
