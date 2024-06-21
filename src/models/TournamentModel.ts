import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TournamentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
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
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'ongoing', 'ended'],
      default: 'ongoing',
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const TournamentModel = mongoose.models.tournament || mongoose.model('tournament', TournamentSchema)
export default TournamentModel

export interface ITournament {
  _id: string
  name: string
  type: string
  startedAt: string
  endedAt: string
  gender: string
  status: string
  note: string
  createdAt: string
  updatedAt: string

  // sub
  teamQuantity: number
}
