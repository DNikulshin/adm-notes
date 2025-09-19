import axios from 'axios'
import { OpenAPI } from './generated'
import { useSession } from '../model/session'
import { CONFIG } from '../model/config'

OpenAPI.BASE = CONFIG.API_BASE_URL

OpenAPI.WITH_CREDENTIALS = true

OpenAPI.CLIENT = axios.create({
  withCredentials: true,
})

OpenAPI.CLIENT.interceptors.request.use(
  async (config: { headers: { Authorization: string } }) => {
    const token = await useSession.getState().refreshToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)
