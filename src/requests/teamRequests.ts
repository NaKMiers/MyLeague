// TEAM

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
