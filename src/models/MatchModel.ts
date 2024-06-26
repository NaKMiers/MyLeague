import mongoose from 'mongoose'
import { IRound } from './RoundModel'
import { ITeam } from './TeamModel'
import { ITournament } from './TournamentModel'
const Schema = mongoose.Schema

const MatchSchema = new Schema(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: 'tournament',
      required: true,
    },
    roundId: {
      type: Schema.Types.ObjectId,
      ref: 'round',
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
    status: {
      type: String,
      enum: ['waiting', 'ongoing', 'finished'],
      default: 'waiting',
    },
    results: [
      {
        teamId: {
          type: Schema.Types.ObjectId,
          ref: 'team',
        },
        goal: {
          type: Number,
          default: 0,
        },
        score: {
          type: Number,
          default: 0,
        },
        fault: {
          type: Number,
          default: 0,
        },
        yellowCard: {
          type: Number,
          default: 0,
        },
        redCard: {
          type: Number,
          default: 0,
        },
        note: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const MatchModel = mongoose.models.match || mongoose.model('match', MatchSchema)
export default MatchModel

export interface IMatch {
  _id: string
  tournamentId: string | ITournament
  roundId: string | IRound
  name: string
  teams: string[] | ITeam[]
  startedAt: string
  status: 'waiting' | 'ongoing' | 'finished'
  results: any[]
  createdAt: string
  updatedAt: string
}
