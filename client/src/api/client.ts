import type { ApiError } from '@/types/common'

const TOKEN_KEY = 'workspace_ai_token'

class ApiClient {
  private baseUrl = '/api'

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem(TOKEN_KEY)
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: this.getAuthHeaders(),
      ...options,
    })
    if (!res.ok) {
      const body = (await res.json().catch(() => ({ error: res.statusText }))) as ApiError
      throw body
    }
    return res.json() as Promise<T>
  }

  get<T>(path: string) {
    return this.request<T>(path)
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) })
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
  }

  del<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' })
  }
}

export const api = new ApiClient()
