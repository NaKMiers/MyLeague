import mongoose from 'mongoose'
import { ITeam } from './TeamModel'
import { ITournament } from './TournamentModel'
import { IMatch } from './MatchModel'
const Schema = mongoose.Schema

const RoundSchema = new Schema(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: 'tournament',
    },
    name: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
    },
    result: {
      winner: {
        type: Schema.Types.ObjectId,
        ref: 'team',
      },
      note: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
)

const RoundModel = mongoose.models.round || mongoose.model('round', RoundSchema)
export default RoundModel

export interface IRound {
  _id: string
  tournamentId: string | ITournament
  name: string
  teams: string[] | ITeam[]
  startedAt: string
  endedAt: string
  result: any
  createdAt: string
  updatedAt: string

  // sub
  matches: IMatch[]
}
