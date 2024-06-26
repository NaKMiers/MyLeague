import PageLoading from '@/components/PageLoading'
import Sidebar from '@/components/Sidebar'
import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Toaster } from 'react-hot-toast'
import '../globals.scss'

export const metadata: Metadata = {
  title: 'My League',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  return (
    <html lang='vi'>
      <body className='' suppressHydrationWarning={true}>
        <StoreProvider session={session}>
          {/* Toast */}
          <Toaster
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />

          {/* Loading */}
          <PageLoading />

          {/* Main */}
          <main className='relative min-h-screen flex items-start'>
            <Sidebar />
            <div className='p-21 w-full'>{children}</div>
          </main>
        </StoreProvider>
      </body>
    </html>
  )
}
