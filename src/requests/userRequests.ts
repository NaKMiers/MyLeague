// USER

// [GET]: /api/admin/user
export const getAllUsersApi = async (prefix: string = '') => {
  const res = await fetch(`${prefix}/api/admin/user`, {
    next: { revalidate: 0 },
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [POST]: /api/admin/user/add
export const addUserApi = async (data: any) => {
  const res = await fetch('/api/admin/user/add', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [PUT]: /api/admin/user/:id/edit
export const updateUserApi = async (id: string, data: any) => {
  const res = await fetch(`/api/admin/user/${id}/edit`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

// [DELETE]: /api/admin/user/:id
export const deleteUserApi = async (id: string) => {
  const res = await fetch(`/api/admin/user/${id}/delete`, {
    method: 'DELETE',
  })

  // check status
  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
