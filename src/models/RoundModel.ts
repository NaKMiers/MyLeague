import mongoose from 'mongoose'
import { ITeam } from './TeamModel'
import { ITournament } from './Tournament'
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
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'team',
      },
    ],
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
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
  createdAt: string
  updatedAt: string
}
