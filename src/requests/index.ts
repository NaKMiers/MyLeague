export * from './teamRequests'
export * from './tournamentRequest'
export * from './userRequests'
export * from './userRequests'
export * from './matchRequests'

// [GET]: /api
export const geHomePageApi = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
