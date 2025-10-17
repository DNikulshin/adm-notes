import { useSession } from '@/shared/model/session'
import { Button } from '@/shared/ui/kit/button'
import { ROUTES } from '@/shared/model/routes'
import { useNavigate, useLocation } from 'react-router-dom'

export function AppHeader() {
  const logout = useSession((state) => state.logout)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const handleNavigateToNotes = () => {
    navigate(ROUTES.NOTES)
  }

  // Show "Notes" button only when we're on a specific note page
  const showNotesButton =
    location.pathname.startsWith('/notes/') && location.pathname !== '/notes'

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">ADM Notes</h1>
        <div className="flex space-x-2">
          {showNotesButton && (
            <Button onClick={handleNavigateToNotes} variant="outline">
              Notes List
            </Button>
          )}
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
