import { notFound } from 'next/navigation'

async function Home() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api`, { next: { revalidate: 0 } })
    const data = await res.json()
  } catch (err: any) {
    // return notFound()
  }

  return <div className='min-h-screen'>Home</div>
}

export default Home
