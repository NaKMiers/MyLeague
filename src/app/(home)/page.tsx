import Divider from '@/components/Divider'
import SearchBar from '@/components/SearchBar'
import TournamentAccordion from '@/components/TournamentAccordion'
import TournamentCard from '@/components/TournamentCard'
import { IMatch } from '@/models/MatchModel'
import { ITeam } from '@/models/TeamModel'
import { ITournament } from '@/models/TournamentModel'
import { geHomePageApi } from '@/requests'
import moment from 'moment'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FaChevronDown } from 'react-icons/fa'

async function Home() {
  // data
  let tournaments: ITournament[] = [] // on-going tournaments
  let matches: IMatch[] = [] // matches in week

  try {
    const data = await geHomePageApi()
    tournaments = data.tournaments
    matches = data.matches
  } catch (err: any) {
    return notFound()
  }

  return (
    <div className='min-h-screen'>
      {/* Search */}
      {/* <div className='max-w-[500px] mx-auto'>
        <SearchBar />
      </div> */}

      {/* <Divider size={8} /> */}

      <TournamentAccordion tournaments={tournaments} />

      <Divider size={12} />

      {/* Matches in week */}
      <h1 className='text-center font-semibold text-3xl text-slate-700'>Các trận đấu trong tuần</h1>

      <Divider size={4} />

      <div className='grid md:grid-cols-4'>
        {matches.map(match => (
          <div className='flex flex-col border p-3 rounded-lg' key={match._id}>
            <div className='flex w-full justify-between items-center gap-3'>
              <div className='relative flex flex-col gap-2'>
                <Image
                  className='aspect-square rounded-lg shadow-lg'
                  src={(match.teams[0] as ITeam).logo}
                  width={80}
                  height={80}
                  alt='logo'
                />
                <p className='text-center font-semibold text-slate-700'>
                  {(match.teams[0] as ITeam).name}
                </p>
              </div>

              <p className='flex items-center flex-nowrap gap-2 justi fy-center text-nowrap font-semibold'>
                {match.results[0]?.goal || '-'} : VS : {match.results[1]?.goal || '-'}
              </p>

              <div className='relative flex flex-col gap-2'>
                <Image
                  className='aspect-square rounded-lg shadow-lg'
                  src={(match.teams[1] as ITeam).logo}
                  width={80}
                  height={80}
                  alt='logo'
                />

                <p className='text-center font-semibold text-slate-700'>
                  {(match.teams[1] as ITeam).name}
                </p>
              </div>
            </div>

            <Divider border size={2} />

            <p className='text-slate-700 text-sm font-body tracking-wider text-center'>
              Thời gian bắt đầu:{' '}
              <span className='text-green-500'>{moment(match.startedAt).format('LLLL')}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
