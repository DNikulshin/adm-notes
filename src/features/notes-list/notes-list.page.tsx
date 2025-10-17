import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DefaultService } from '@/shared/api/generated'
import { useSession } from '@/shared/model/session'
import { ROUTES } from '@/shared/model/routes'
import { Button } from '@/shared/ui/kit/button'
import { CreateNoteForm } from '@/features/note/create-note.form'
import { toast } from '@/shared/ui/kit/toast'

interface Note {
  id: string
  title: string
  completed: boolean
  createdAt?: string
  updatedAt?: string
}

function NotesListPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const token = useSession((state) => state.token)

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await DefaultService.todosControllerFindAll()
      setNotes(response || [])
    } catch (err) {
      setError('Failed to fetch notes')
      toast.error('Failed to fetch notes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (noteId: string, currentStatus: boolean) => {
    try {
      const updatedNote = await DefaultService.todosControllerUpdate(noteId, {
        title: notes.find((n) => n.id === noteId)?.title || '',
        completed: !currentStatus,
      })

      // Update the note in the local state
      setNotes(
        notes.map((note) =>
          note.id === noteId ? { ...note, ...updatedNote } : note
        )
      )

      toast.success(
        `Note marked as ${updatedNote.completed ? 'completed' : 'pending'}`
      )
    } catch (err) {
      toast.error('Failed to update note')
      console.error('Failed to update note', err)
    }
  }

  useEffect(() => {
    if (!token) return

    fetchNotes()
  }, [token])

  if (loading) return <div className="container mx-auto p-4">Loading...</div>
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create Note'}
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
          <CreateNoteForm
            onNoteCreated={() => {
              setShowCreateForm(false)
              fetchNotes()
              toast.success('Note created successfully')
            }}
          />
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't have any notes yet.</p>
          <Button onClick={() => setShowCreateForm(true)}>
            Create your first note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="border rounded-lg overflow-hidden">
              <Link
                to={ROUTES.NOTE.replace(':noteId', note.id)}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <h2 className="font-semibold text-lg mb-2">{note.title}</h2>
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      note.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {note.completed ? 'Completed' : 'Pending'}
                  </span>
                  {note.updatedAt && (
                    <span className="text-gray-500 text-sm">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-4 border-t flex justify-between">
                <Button
                  size="sm"
                  variant={note.completed ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.preventDefault()
                    toggleComplete(note.id, note.completed)
                  }}
                >
                  {note.completed ? 'Completed' : 'Mark Done'}
                </Button>
                <Link to={ROUTES.NOTE.replace(':noteId', note.id)}>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const Component = NotesListPage
