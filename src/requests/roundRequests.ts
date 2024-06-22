// ROUND

// [POST]: /api/admin/round/add
export const addRoundApi = async (tournamentId: string, data: any) => {
  const res = await fetch(`/api/admin/round/${tournamentId}/add`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /api/admin/round/:id/edit
export const editRoundApi = async (tournamentId: string, id: string, data: any) => {
  const res = await fetch(`/api/admin/round/${tournamentId}/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /api/admin/round/:id/delete
export const deleteRoundApi = async (tournamentId: string, id: string) => {
  const res = await fetch(`/api/admin/round/${tournamentId}/${id}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
