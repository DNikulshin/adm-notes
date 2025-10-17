import { OpenAPI } from './generated'
import { CONFIG } from '../model/config'

console.log('API Base URL:', CONFIG.API_BASE_URL)
OpenAPI.BASE = CONFIG.API_BASE_URL

OpenAPI.WITH_CREDENTIALS = true

// Add a request interceptor to include the auth token
OpenAPI.HEADERS = async () => {
  // Dynamically import useSession to avoid circular dependencies
  const { useSession } = await import('../model/session')
  const token = await useSession.getState().refreshToken()
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    }
  }
  return {} as Record<string, string>
}
