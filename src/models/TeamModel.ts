import mongoose from 'mongoose'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    coach: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    logo: {
      type: String,
    },
    city: {
      type: String,
    },
    school: {
      type: String,
      required: true,
    },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    primaryColor: {
      type: String,
      required: true,
    },
    secondaryColor: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    teamResponsibility: {
      description: {
        type: String,
      },
      startedAt: {
        type: Date,
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
      },
    },
    practiceSchedule: [
      {
        startedAt: {
          type: Date,
        },
        endedAt: {
          type: Date,
        },
        note: {
          type: String,
        },
        status: {
          type: String,
          enum: ['active', 'inactive'],
          default: 'inactive',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const TeamModel = mongoose.models.team || mongoose.model('team', TeamSchema)
export default TeamModel

export interface ITeam {
  _id: string
  name: string
  coach: string | IUser
  logo: string
  city: string
  school: string
  players: string[] | IUser[]
  primaryColor: string
  secondaryColor: string
  status: string
  teamResponsibility: {
    description: string
    startedAt: string
    status: string
  }
  practiceSchedule: {
    startedAt: string
    endedAt: string
    note: string
    status: string
  }[]
  createdAt: string
  updatedAt: string
}
