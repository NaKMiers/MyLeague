'use client'

import { ITournament } from '@/models/TournamentModel'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import TournamentCard from './TournamentCard'

interface TournamentAccordionProps {
  tournaments: ITournament[]
  className?: string
}

function TournamentAccordion({ tournaments, className = '' }: TournamentAccordionProps) {
  // states
  const [show, setShow] = useState<boolean>(false)

  return (
    <div>
      <button
        className={`w-full flex items-center justify-between bg-dark-100 text-white rounded-md shadow-lg text-xl py-3 px-21${className}`}
        onClick={() => setShow(prev => !prev)}
      >
        <span>Các giải đấu</span>
        <span>
          <FaChevronDown className={`${show ? 'rotate-180' : ''} trans-200`} size={16} />
        </span>
      </button>
      <div className={`${show ? 'max-h-[500px]' : 'max-h-0'} trans-300 overflow-hidden mt-2`}>
        {/* On-going tournaments */}
        <div className='grid md:grid-cols-3 gap-21'>
          {tournaments.map(tournament => (
            <TournamentCard tournament={tournament} key={tournament._id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TournamentAccordion
