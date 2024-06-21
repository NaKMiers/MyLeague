// MATCH

// [GET]: /api/admin/matches
export const getAllMatchesApi = async () => {
  const res = await fetch(`/api/match`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /api/admin/match/add
export const addMatchApi = async (data: any) => {
  const res = await fetch(`/api/admin/match/add`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /api/admin/match/:id/edit
export const editMatchApi = async (id: string, data: any) => {
  const res = await fetch(`/api/match/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /api/admin/match/:id/delete
export const deleteMatchApi = async (id: string) => {
  const res = await fetch(`/api/admin/match/${id}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
