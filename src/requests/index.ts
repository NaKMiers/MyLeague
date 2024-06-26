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

// [POST]: /api/auth/forgot-password
export const forgotPasswordApi = async (data: any) => {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]
export const resetPasswordApi = async (token: string, newPassword: string) => {
  const res = await fetch(`/api/auth/reset-password?token=${token}`, {
    method: 'PATCH',
    body: JSON.stringify({ newPassword }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
