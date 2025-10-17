import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { AuthService } from '../api/generated'

type Session = {
  userId: string
  email: string
  exp: number
  iat: number
}

const TOKEN_KEY = 'token'

let refreshTokenPromise: Promise<string | null> | null = null

type SessionState = {
  token: string | null
  session: Session | null
  login: (token: string) => void
  logout: () => void
  refreshToken: () => Promise<string | null>
}

export const useSession = create<SessionState>((set, get) => {
  const getInitialToken = () => {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem(TOKEN_KEY)
  }

  const getInitialSession = (token: string | null) => {
    if (!token) {
      return null
    }
    try {
      return jwtDecode<Session>(token)
    } catch (error) {
      console.error('Failed to decode token:', error)
      // If token is invalid, remove it from localStorage
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
  }

  const initialToken = getInitialToken()

  return {
    token: initialToken,
    session: getInitialSession(initialToken),

    login: (token: string) => {
      // Validate token before storing
      try {
        jwtDecode<Session>(token)
        localStorage.setItem(TOKEN_KEY, token)
        set({ token, session: jwtDecode<Session>(token) })
      } catch (error) {
        console.error('Failed to decode token during login:', error)
        throw new Error('Invalid token received from server')
      }
    },

    logout: () => {
      localStorage.removeItem(TOKEN_KEY)
      set({ token: null, session: null })
    },

    refreshToken: async () => {
      const { token, login, logout } = get()
      if (!token) {
        return null
      }

      // Validate current token
      try {
        const session = jwtDecode<Session>(token)

        // Check if token is expired
        if (session.exp < Date.now() / 1000) {
          if (!refreshTokenPromise) {
            refreshTokenPromise = AuthService.authControllerRefresh()
              .then((response: string | null) => {
                // The refresh endpoint returns a new access token directly
                if (response) {
                  // Validate the new token before using it
                  try {
                    jwtDecode(response)
                    login(response)
                    return response
                  } catch (error) {
                    console.error(
                      'Failed to decode new token from refresh:',
                      error
                    )
                    logout()
                    return null
                  }
                } else {
                  logout()
                  return null
                }
              })
              .catch((error) => {
                console.error('Refresh token error:', error)
                logout()
                return null
              })
              .finally(() => {
                refreshTokenPromise = null
              })
          }

          const newToken = await refreshTokenPromise

          if (newToken) {
            return newToken
          } else {
            return null
          }
        }

        return token
      } catch (error) {
        console.error('Failed to decode current token in refreshToken:', error)
        // If current token is invalid, logout
        logout()
        return null
      }
    },
  }
})
