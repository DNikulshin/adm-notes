import { PathParams, ROUTES } from '@/shared/model/routes'
import { useParams } from 'react-router-dom'

function NotePage() {
  const params = useParams<PathParams[typeof ROUTES.NOTES]>()
  return (
    <div>
      Note page - {params.noteId}
      {/* <Link to={href(ROUTES.NOTES, { noteId: params.noteId })} /> */}
    </div>
  )
}

export const Component = NotePage
