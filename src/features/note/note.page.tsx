import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DefaultService } from '@/shared/api/generated'
import { useSession } from '@/shared/model/session'
import { Button } from '@/shared/ui/kit/button'
import { toast } from '@/shared/ui/kit/toast'
import { ConfirmDialog } from '@/shared/ui/kit/confirm-dialog'

interface Note {
  id: string
  title: string
  completed: boolean
  createdAt?: string
  updatedAt?: string
}

function NotePage() {
  const params = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const token = useSession((state) => state.token)

  useEffect(() => {
    if (!token || !params.noteId) return

    const fetchNote = async () => {
      try {
        setLoading(true)
        const response = await DefaultService.todosControllerFindOne(
          params.noteId!
        )
        setNote(response)
        setEditTitle(response.title)
      } catch (err) {
        setError('Failed to fetch note')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [params.noteId, token])

  const handleUpdate = async () => {
    if (!note) return

    try {
      const updatedNote = await DefaultService.todosControllerUpdate(note.id, {
        title: editTitle,
        completed: note.completed,
      })
      setNote(updatedNote)
      setIsEditing(false)
      toast.success('Note updated successfully')
    } catch (err) {
      setError('Failed to update note')
      toast.error('Failed to update note')
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!note) return

    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!note) return

    try {
      await DefaultService.todosControllerRemove(note.id)
      toast.success('Note deleted successfully')
      navigate('/notes')
    } catch (err) {
      setError('Failed to delete note')
      toast.error('Failed to delete note')
      console.error(err)
    }
  }

  const toggleComplete = async () => {
    if (!note) return

    try {
      const updatedNote = await DefaultService.todosControllerUpdate(note.id, {
        title: note.title,
        completed: !note.completed,
      })
      setNote(updatedNote)
      toast.success(
        `Note marked as ${updatedNote.completed ? 'completed' : 'pending'}`
      )
    } catch (err) {
      setError('Failed to update note')
      toast.error('Failed to update note')
      console.error(err)
    }
  }

  if (loading) return <div className="container mx-auto p-4">Loading...</div>
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>
  if (!note) return <div className="container mx-auto p-4">Note not found</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-2xl font-bold w-full p-2 border rounded"
            />
          ) : (
            <h1 className="text-2xl font-bold">{note.title}</h1>
          )}
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleUpdate}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <Button
          variant={note.completed ? 'default' : 'outline'}
          onClick={toggleComplete}
        >
          {note.completed ? 'Completed' : 'Mark as Completed'}
        </Button>
      </div>

      <div className="text-gray-600 text-sm">
        {note.createdAt && (
          <div>Created: {new Date(note.createdAt).toLocaleString()}</div>
        )}
        {note.updatedAt && (
          <div>Updated: {new Date(note.updatedAt).toLocaleString()}</div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export const Component = NotePage
