import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { DefaultService } from '../api/generated'

type Session = {
  userId: string
  email: string
  exp: number
  iat: number
}

const TOKEN_KEY = 'token'

let refreshTokenPromise: Promise<string | null> | null = null

type SessionState = {
    token: string | null;
    session: Session | null;
    login: (token: string) => void;
    logout: () => void;
    refreshToken: () => Promise<string | null>;
}

export const useSession = create<SessionState>((set, get) => {
    const getInitialToken = () => {
        if (typeof window === 'undefined') {
            return null;
        }
        return localStorage.getItem(TOKEN_KEY);
    };

    const getInitialSession = (token: string | null) => {
        if (!token) {
            return null;
        }
        try {
            return jwtDecode<Session>(token);
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    };

    const initialToken = getInitialToken();

    return {
        token: initialToken,
        session: getInitialSession(initialToken),

        login: (token: string) => {
            localStorage.setItem(TOKEN_KEY, token);
            set({ token, session: jwtDecode<Session>(token) });
        },

        logout: () => {
            localStorage.removeItem(TOKEN_KEY);
            set({ token: null, session: null });
        },

        refreshToken: async () => {
            const { token, login, logout } = get();
            if (!token) {
                return null;
            }

            const session = jwtDecode<Session>(token);

            if (session.exp < Date.now() / 1000) {
                if (!refreshTokenPromise) {
                    refreshTokenPromise = DefaultService.authControllerRefreshToken({ refreshToken: token })
                        .then((response: any) => {
                            const newToken = response.accessToken;
                            if (newToken) {
                                login(newToken);
                                return newToken;
                            } else {
                                logout();
                                return null;
                            }
                        })
                        .catch(() => {
                            logout();
                            return null;
                        })
                        .finally(() => {
                            refreshTokenPromise = null;
                        });
                }

                const newToken = await refreshTokenPromise;

                if (newToken) {
                    return newToken;
                } else {
                    return null;
                }
            }

            return token;
        },
    }
});