import Divider from '@/components/Divider'
import { ITeam } from '@/models/TeamModel'
import { IUser } from '@/models/UserModel'
import { getTeamDetailApi } from '@/requests'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import './team.scss'

async function TeamDetail({ params: { id } }: { params: { id: string } }) {
  let team: ITeam | null = null

  try {
    const data = await getTeamDetailApi(id)

    if (!data.team) return redirect('/')

    team = data.team
  } catch (err: any) {
    redirect('/')
  }

  return (
    <div className='w-full'>
      <h1 className='text-4xl font-semibold text-slate-500'>
        Đội <span>{team?.name}</span>
      </h1>
      <Divider border size={4} />

      {/* Team Info */}
      <section className='flex flex-col items-start md:flex-row gap-21'>
        <div
          className={`flex items-center justify-center overflow-hidden rounded-lg shadow-lg max-w-[250px] group relative w-full border-2 border-white`}
        >
          {/* Logo */}
          {team && (
            <Image
              className='h-full w-full object-cover'
              src={team.logo}
              width={250}
              height={250}
              alt='logo'
            />
          )}
        </div>

        <div className='flex-1 gap-21 grid md:grid-cols-2'>
          <div>
            <p className='font-body tracking-wider text-slate-700 text-2xl'>
              Tên đội bóng: <span className='font-semibold'>{team?.name}</span>
            </p>
          </div>

          <div>
            <p className='font-body tracking-wider text-slate-700 text-2xl'>
              Huấn luận viên: <span className='font-semibold'>{(team?.coach as IUser).fullName}</span>
            </p>
          </div>

          <div>
            <p className='font-body tracking-wider text-slate-700 text-2xl'>
              Email: <span className='font-semibold'>{(team?.coach as IUser).email}</span>
            </p>
          </div>

          <div>
            <p className='font-body tracking-wider text-slate-700 text-2xl'>
              Số điện thoại: <span className='font-semibold'>{(team?.coach as IUser).phone}</span>
            </p>
          </div>

          <div>
            <p className='font-body tracking-wider text-slate-700 text-2xl'>
              Trường: <span className='font-semibold'>{team?.school}</span>
            </p>
          </div>

          <div>
            <p className='font-body tracking-wider text-slate-700 text-2xl'>
              Thành phố: <span className='font-semibold'>{team?.city}</span>
            </p>
          </div>

          <div>
            <p className='font-body tracking-wider text-slate-700 text-2xl'>
              Máu áo chính: <span className='font-semibold'>{team?.primaryColor}</span>
            </p>
          </div>

          <div>
            <p className='font-body tracking-wider text-slate-700 text-2xl'>
              Máu áo phụ: <span className='font-semibold'>{team?.secondaryColor}</span>
            </p>
          </div>
        </div>
      </section>

      <Divider size={8} />

      <h1 className='text-4xl font-semibold text-slate-500 flex items-center gap-3'>
        Cầu thủ ({team?.players.length})
      </h1>

      <Divider border size={4} />

      {/* Players */}
      <section>
        <div className='grid md:grid-cols-2 gap-21'>
          {(team?.players as IUser[]).map((player, index) => (
            <div
              className={`relative flex flex-col gap-1 rounded-lg border-2 shadow-lg p-4`}
              key={player._id}
            >
              <h3 className='text-slate-500 font-semibold'>Cầu thủ {index + 1}</h3>

              <p className='font-body tracking-wider text-slate-700 text-lg'>
                Họ và tên: <span className='font-semibold'>{player.fullName}</span>
              </p>

              <p className='font-body tracking-wider text-slate-700 text-lg'>
                Email: <span className='font-semibold'>{player.email}</span>
              </p>

              <p className='font-body tracking-wider text-slate-700 text-lg'>
                Số điện thoại: <span className='font-semibold'>{player.phone}</span>
              </p>

              {/* Gender */}
              <p className='font-body tracking-wider text-slate-700 text-lg'>
                Giới tính: <span className='font-semibold'>{player.gender}</span>
              </p>

              {/* Role */}
              <p className='font-body tracking-wider text-slate-700 text-lg'>
                Vai trò: <span className='font-semibold'>{player.role}</span>
              </p>

              {/* Number */}
              <p className='font-body tracking-wider text-slate-700 text-lg'>
                Số áo: <span className='font-semibold'>{player.number}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <Divider size={4} />
    </div>
  )
}

export default TeamDetail
