import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    // Authentication
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        },
        message: 'Email không hợp lệ',
      },
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: function (value: string) {
          return /^0\d{9,10}$/.test(value)
        },
        message: 'Số điện thoại không hợp lệ',
      },
    },
    password: {
      type: String,
      required: function (this: { authType: string }) {
        return this.authType === 'local'
      },
      validate: {
        validator: function (value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)
        },
        message: 'Mật khẩu không hợp lệ',
      },
    },
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook', 'github'],
      default: 'local',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    role: {
      type: String,
      enum: [
        'coach',
        'admin',
        'employee',
        'striker',
        'centralDefender',
        'defender',
        'goalie',
        'reserve',
      ],
    },

    // Information
    avatar: {
      type: String,
      default: process.env.NEXT_PUBLIC_DEFAULT_AVATAR,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    number: {
      type: Number,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// UserSchema.pre('save', async function (next) {
//   console.log('- Pre Save User -')
//   // check authType & username before saving
//   if (this.authType !== 'local' || !this.isModified('password')) {
//     return next()
//   }

//   // hash password before saving
//   try {
//     const hashedPassword = await bcrypt.hash(this.password || '', +process.env.BCRYPT_SALT_ROUND! || 10)
//     this.password = hashedPassword

//     next()
//   } catch (err: any) {
//     return next(err)
//   }
// })

const UserModel = mongoose.models.user || mongoose.model('user', UserSchema)
export default UserModel

export interface IUser {
  _id: string
  fullName: string
  email: string
  phone: string
  password: string
  authType: string
  role: string
  avatar: string
  gender: string
  number: number
  note: string
  status: string
  createdAt: string
  updatedAt: string
}
