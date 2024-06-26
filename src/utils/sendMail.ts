import ResetPasswordEmail from '@/components/emails/ResetPasswordEmail'
import { render } from '@react-email/render'
import nodeMailer from 'nodemailer'

// Models: User
import '@/models/UserModel'

// SEND MAIL CORE
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_MAIL,
    pass: process.env.MAIL_APP_PASSWORD,
  },
})

export async function sendMail(to: string | string[], subject: string, html: string) {
  console.log('- Send Mail -')

  await transporter.sendMail({
    from: 'Mileg <no-reply@cosanpha.omega@gmail.com>',
    to: to,
    subject: subject,
    html: html,
  })
}
// reset password email
export async function sendResetPasswordEmail(email: string, name: string, link: string) {
  console.log('- Send Reset Password Email -')

  try {
    // Render template với dữ liệu
    const html = render(ResetPasswordEmail({ name, link }))

    await sendMail(email, 'Reset Password', html)
  } catch (err: any) {
    console.log(err)
  }
}
