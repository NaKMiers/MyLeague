import Divider from '@/components/Divider'
import Round from '@/components/Round'
import { IRound } from '@/models/RoundModel'
import { ITeam } from '@/models/TeamModel'
import { ITournament } from '@/models/TournamentModel'
import { getTournamentApi } from '@/requests'
import moment from 'moment'
import { redirect } from 'next/navigation'

async function TournamentDetail({ params: { id } }: { params: { id: string } }) {
  let tournament: ITournament | null = null
  let rounds: IRound[] = []
  let teams: ITeam[] = []

  try {
    const data = await getTournamentApi(id, process.env.NEXT_PUBLIC_APP_URL)
    tournament = data.tournament
    rounds = data.rounds
    teams = data.teams
  } catch (err: any) {
    console.log(err)
    return redirect('/')
  }

  return (
    <div>
      {/* Tournament */}
      <h1 className='text-3xl font-semibold text-slate-500 flex items-center gap-3'>
        Giải đấu: <span className='text-slate-700'>{tournament?.name}</span>
      </h1>
      <Divider border size={4} />

      <div className=''>
        <p className='font-body text-slate-700 tracking-wider'>
          Thể lệ đấu: <span className='text-slate-600 font-semibold'>{tournament?.type}</span>
        </p>
        <p className='font-body text-slate-700 tracking-wider'>
          Số lượng đội: <span className='text-slate-600 font-semibold'>{tournament?.teamQuantity}</span>
        </p>
        <p className='font-body text-slate-700 tracking-wider'>
          Giới tính:{' '}
          <span className='text-slate-600 font-semibold'>
            {tournament?.gender === 'male' ? 'Nam' : 'Nữ'}
          </span>
        </p>
        <p className='font-body text-slate-700 tracking-wider'>
          Ngày bắt đầu:{' '}
          <span className='text-slate-600 font-semibold'>
            {tournament?.startedAt ? moment(tournament.startedAt).format('LLLL') : '-'}
          </span>
        </p>
      </div>

      <Divider size={12} />

      {/* Rounds */}
      <h1 className='text-3xl font-semibold text-slate-500 flex items-center gap-3'>Các vòng đấu</h1>
      <Divider border size={4} />

      {/* Rounds */}
      <div className='grid grid-cols-1 gap-12'>
        {rounds.map(round => (
          <Round teams={teams} round={round} key={round._id} />
        ))}
      </div>
    </div>
  )
}

export default TournamentDetail
