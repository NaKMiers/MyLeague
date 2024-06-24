'use client'
import Divider from '@/components/Divider'
import Ranking from '@/components/Ranking'
import RoundCard from '@/components/RoundCard'
import RoundModal from '@/components/RoundModal'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IRound } from '@/models/RoundModel'
import { ITeam } from '@/models/TeamModel'
import { ITournament } from '@/models/TournamentModel'
import { getTournamentApi, rankTournamentApi } from '@/requests'
import moment from 'moment'
import 'moment/locale/vi'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function TournamentDetail({ params: { id } }: { params: { id: string } }) {
  // hook
  const dispatch = useAppDispatch()

  // states
  const [tournament, setTournament] = useState<ITournament | null>(null)
  const [rounds, setRounds] = useState<IRound[]>([])
  const [teams, setTeams] = useState<ITeam[]>([])
  const [ranks, setRanks] = useState<any[]>([])
  const [openRoundModal, setOpenRoundModal] = useState<boolean>(false)

  // get tournament
  useEffect(() => {
    const getTournament = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { tournament, rounds, teams, ranks } = await getTournamentApi(id)
        setTournament(tournament)
        setRounds(rounds)
        setTeams(teams)
        setRanks(ranks)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // end page loading
        dispatch(setPageLoading(false))
      }
    }

    getTournament()
  }, [dispatch, id])

  // handle ranking
  const handleRanking = useCallback(async () => {
    try {
      const { message } = await rankTournamentApi(id)
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [id])

  return (
    <div>
      {/* Tournament */}
      <h1 className='text-3xl font-semibold text-slate-500 flex items-center flex-wrap gap-3'>
        Giải đấu: <span className='text-slate-700'>{tournament?.name}</span>
        <button
          className='border-2 px-2 py-1.5 rounded-lg text-sm hover:border-dark hover:text-dark trans-200'
          onClick={handleRanking}
        >
          Xếp hạng
        </button>
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

      <Divider size={8} />

      {/* Ranking */}
      <Ranking ranks={ranks} />

      <Divider size={12} />

      {/* Rounds */}
      <h1 className='text-3xl font-semibold text-slate-500 flex items-center gap-3'>
        Các vòng đấu
        <button
          className='rounded-lg border-2 px-2 py-1.5 text-sm hover:text-dark hover:border-dark trans-200'
          onClick={() => setOpenRoundModal(true)}
        >
          Thêm vòng
        </button>
      </h1>
      <Divider border size={4} />

      {/* Add Round Modal */}
      <RoundModal
        title='Thêm vòng đấu'
        open={openRoundModal}
        setOpen={setOpenRoundModal}
        setRounds={setRounds}
        teams={teams}
      />

      {/* Rounds */}
      <div className='grid grid-cols-1 gap-12'>
        {rounds.map(round => (
          <RoundCard teams={teams} admin round={round} setRounds={setRounds} key={round._id} />
        ))}
      </div>
    </div>
  )
}

export default TournamentDetail
