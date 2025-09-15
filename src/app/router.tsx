import { ROUTES } from '../shared/model/routes'
import { createBrowserRouter, redirect } from 'react-router-dom'
import { App } from './app'
import { Providers } from './providers'
import { protectedLoader, ProtectedRoute } from './protected-route'
import { AppHeader } from '@/features/header'

export const router = createBrowserRouter([
  {
    element: (
      <Providers>
        <App />
      </Providers>
    ),
    children: [
      {
        loader: protectedLoader,
        element: (
          <>
            <AppHeader />
            <ProtectedRoute />
          </>
        ),
        children: [
          {
            path: ROUTES.NOTES,
            lazy: () => import('@/features/notes-list/notes-list.page'),
          },
          {
            path: ROUTES.NOTE,
            lazy: () => import('@/features/note/note.page'),
          },
          {
            path: ROUTES.LOGIN,
            lazy: () => import('@/features/auth/login.page'),
          },
          {
            path: ROUTES.REGISTER,
            lazy: () => import('@/features/auth/register.page'),
          },
          {
            path: ROUTES.HOME,
            loader: () => redirect(ROUTES.NOTES),
          },
        ],
      },
    ],
  },
])
