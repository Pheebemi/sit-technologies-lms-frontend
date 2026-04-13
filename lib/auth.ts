import { API_ROOT } from './api'

type Tokens = { access: string; refresh: string }

export function getTokens(): Tokens | null {
  if (typeof window === 'undefined') return null
  const access = localStorage.getItem('access_token')
  const refresh = localStorage.getItem('refresh_token')
  if (!access || !refresh) return null
  return { access, refresh }
}

export function saveTokens(tokens: Tokens) {
  if (typeof window === 'undefined') return
  localStorage.setItem('access', tokens.access)
  localStorage.setItem('refresh', tokens.refresh)
}

export async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) throw new Error('No refresh token')

  const res = await fetch(`${API_ROOT}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
  if (!res.ok) throw await res.json()
  const data = await res.json()
  if (data.access) {
    localStorage.setItem('access', data.access)
  }
  return data.access
}

export async function authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const tokens = getTokens()
  const headers = new Headers(init?.headers || {})
  if (tokens?.access) headers.set('Authorization', `Bearer ${tokens.access}`)

  let response = await fetch(input, { ...init, headers })
  if (response.status === 401) {
    try {
      const newAccess = await refreshAccessToken()
      headers.set('Authorization', `Bearer ${newAccess}`)
      response = await fetch(input, { ...init, headers })
    } catch (err) {
      throw err
    }
  }
  return response
}
