import Divider from '@/components/Divider'
import { ITournament } from '@/models/TournamentModel'
import { getOngoingTournamentsApi } from '@/requests'
import moment from 'moment'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import './tournaments.scss'

async function TournamentPage() {
  let tournaments: ITournament[] = []

  try {
    const data = await getOngoingTournamentsApi(process.env.NEXT_PUBLIC_APP_URL)
    tournaments = data.tournaments
  } catch (err: any) {
    redirect('/')
  }

  return (
    <div>
      <h1 className='text-4xl font-semibold text-slate-500'>Các giải đấu đang diễn ra</h1>
      <Divider border size={4} />

      {tournaments.length ? (
        <div className='grid md:grid-cols-2 gap-21'>
          {tournaments.map(tournament => (
            <Link
              href={`/tournament/${tournament._id}`}
              className={`gap-2 border-2 border-dark rounded-lg shadow-lg p-4`}
              key={tournament._id}
            >
              <h2 className='text-2xl font-semibold text-dark'>Giải đấu: {tournament.name}</h2>
              <p className='text-lg text-dark-300'>
                Thể lệ đấu: <span className='font-semibold text-slate-600'>{tournament.type}</span>
              </p>
              <p className='text-lg text-dark-300'>
                Giới tính:{' '}
                <span className='font-semibold text-slate-600'>
                  {tournament.gender === 'male' ? 'Nam' : tournament.gender === 'female' ? 'Nữ' : 'Khác'}
                </span>
              </p>
              <p className='text-lg text-dark-300'>
                Bắt đầu:{' '}
                <span className='rounded-md px-1.5 border border-green-500 text-green-500'>
                  {moment(tournament.startedAt).format('DD/MM/YYYY HH:mm')}
                </span>
              </p>
              <p className='text-lg text-dark-300'>
                Kết thúc:{' '}
                <span className='rounded-md px-1.5 border border-slate-500 text-slate-500'>
                  {tournament.endedAt
                    ? moment(tournament.endedAt).format('DD/MM/YYYY HH:mm')
                    : 'Chưa kết thúc'}
                </span>
              </p>
              <p className='text-lg text-dark-300'>
                Trạng thái:{' '}
                <span
                  className={`rounded-md px-1.5 border ${
                    tournament.status === 'pending'
                      ? 'text-yellow-500 border-yellow-500'
                      : tournament.status === 'ongoing'
                      ? 'text-green-500 border-green-500'
                      : 'text-slate-500 border-slate-500'
                  }`}
                >
                  {tournament.status === 'pending'
                    ? 'Chờ xác nhận'
                    : tournament.status === 'ongoing'
                    ? 'Đang diễn ra'
                    : 'Đã kết thúc'}
                </span>
              </p>
              <p className='text-lg text-dark-300'>
                Note: <span className='text-slate-600 text-base'>{tournament.note}</span>
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <h4 className='text-center text-slate-500 text-lg font-body tracking-wider'>
          Chưa có giải đấu nào, hãy quay lại sau.{' '}
          <Link href='/' className='underline text-sky-500'>
            Trang chủ
          </Link>
        </h4>
      )}
    </div>
  )
}

export default TournamentPage
