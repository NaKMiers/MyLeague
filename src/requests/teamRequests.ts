// TEAM

// [GET]: /api/team/[id]
export const getTeamDetailApi = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/team/${id}`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /api/team/my-teams
export const getMyTeamsApi = async () => {
  const res = await fetch(`/api/team/my-teams`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /api/admin/team
export const getAllTeamsApi = async (prefix: string = '') => {
  const res = await fetch(`${prefix}/api/admin/team`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /api/team/register
export const registerTeamApi = async (data: FormData) => {
  const res = await fetch('/api/team/register', {
    method: 'POST',
    body: data,
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PATCH]: /api/team/:id/accept
export const updateTeamStatusApi = async (id: string, value: boolean) => {
  const res = await fetch(`/api/admin/team/${id}/accept`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
