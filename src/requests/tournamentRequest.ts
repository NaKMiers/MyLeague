// TOURNAMENT

// [GET]: /api/tournament
export const getOngoingTournamentsApi = async (prefix: string = '') => {
  const res = await fetch(`${prefix}/api/tournament`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /api/tournament/:id
export const rankTournamentApi = async (id: string) => {
  const res = await fetch(`/api/admin/tournament/${id}/ranking`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /api/admin/tournament
export const getAllTournamentsApi = async () => {
  const res = await fetch(`/api/admin/tournament`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [GET]: /api/admin/tournament/:id
export const getTournamentApi = async (id: string, prefix: string = '') => {
  const res = await fetch(`${prefix}/api/tournament/${id}`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /api/admin/tournament/add
export const addTournamentApi = async (data: any) => {
  const res = await fetch('/api/admin/tournament/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /api/admin/tournament/:id/edit
export const updateTournamentApi = async (id: string, data: any) => {
  const res = await fetch(`/api/admin/tournament/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /api/admin/tournament/:id
export const deleteTournamentApi = async (id: string) => {
  const res = await fetch(`/api/admin/tournament/${id}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
