'use client'

import Image from 'next/image'

interface RankingProps {
  ranks: any[]
  className?: string
}

function Ranking({ ranks, className = '' }: RankingProps) {
  return (
    <div className={`relative overflow-x-auto max-w-[500px] ${className}`}>
      <table className='w-full text-sm text-left rounded-lg text-white overflow-hidden'>
        <thead className='text-xs uppercase bg-gray-700 text-nowrap'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Đội
            </th>
            <th scope='col' className='px-6 py-3'>
              Số trận thắng - Thua - Hòa
            </th>
            <th scope='col' className='px-6 py-3'>
              Hạng
            </th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((team, index) => (
            <tr className='border-b bg-gray-800 border-gray-700' key={team._id}>
              <th scope='row' className='px-6 py-4 font-medium'>
                <div className='relative flex items-center gap-2'>
                  <Image
                    className='aspect-square rounded-lg shadow-lg'
                    src={team.logo}
                    width={40}
                    height={40}
                    alt='logo'
                  />
                  <p className='text-center font-semibold'>{team.name}</p>
                </div>
              </th>
              <td className='px-6 py-4 font-semibold text-lg'>
                {team.win} - {team.lose} - {team.draw}
              </td>
              <td className='px-6 py-4 font-semibold text-lg'>{index + 1}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Ranking
