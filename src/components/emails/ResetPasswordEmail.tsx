import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

function ResetPasswordEmail({
  name = 'David Pi',
  link = 'https://mileg.vercel.app',
}: {
  name?: string
  link?: string
}) {
  return (
    <Tailwind
      config={{
        theme,
      }}
    >
      <Body className='text-dark font-sans'>
        <Container className='bg-white p-4 pb-6'>
          <Section className='inline-block mx-auto'>
            <Row className='mb-3 w-full'>
              <Column>
                <a href='https://mileg.vercel.app'>
                  <Img
                    className='aspect-square rounded-full'
                    src={`${'https://mileg.vercel.app'}/images/logo.png`}
                    width={35}
                    height={35}
                    alt='logo'
                  />
                </a>
              </Column>
              <Column>
                <a
                  href='https://mileg.vercel.app'
                  className='text-2xl font-bold tracking-[0.3px] no-underline text-dark'
                >
                  My League
                </a>
              </Column>
            </Row>
          </Section>

          <div
            className='border-t'
            style={{
              borderTop: '1px solid rgb(0, 0, 0, 0.1)',
            }}
          />

          <Section className='px-5'>
            <p>Hi {name},</p>
            <p>
              Bạn vừa gửi yêu cầu khôi phục mật khẩu tại{' '}
              <span className='font-semibold'>&quot;MyLeague&quot;</span>{' '}
              {new Intl.DateTimeFormat('vi', {
                dateStyle: 'full',
                timeStyle: 'medium',
                timeZone: 'Asia/Ho_Chi_Minh',
              }).format(new Date())}
              .
            </p>

            <p>Nếu đây không phải bạn, hãy bỏ qua email này.</p>

            <p>
              Ngược lại, nếu đây là bạn, hãy ấn vào nút bên dưới để{' '}
              <a href={link} className='text-blue-500'>
                khôi phục mật khẩu
              </a>{' '}
              ngay.
            </p>

            <div className='text-center p-3'>
              <a
                href={link}
                className='inline bg-sky-500 no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'
              >
                Khôi phục mật khẩu
              </a>
            </div>

            <p>Để giữ cho tài khoản của bạn được an toàn, đừng chia sẻ email này với bất kì ai khác!</p>
            <p>
              Chân thành cảm ơn bạn,
              <br />
              MyLeague
            </p>
          </Section>

          <p className='text-center text-xs text-slate-600'>
            © 2023 | MyLeague - Developed by Nguyen Anh Khoa, Phuong Anh, Quoc Thang, Hong Ngoc, All
            rights reserved.
          </p>
        </Container>
      </Body>
    </Tailwind>
  )
}

export default ResetPasswordEmail
