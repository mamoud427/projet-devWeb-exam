import { useEffect, useState } from 'react'
import { Send, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchComments, createComment, deleteComment } from '../../store/slices/commentSlice'
import type { RootState } from '../../store'
import { Avatar } from '../ui/Avatar'
import { Spinner } from '../ui/Spinner'

interface CommentSectionProps {
  taskId: string
}

export const CommentSection = ({ taskId }: CommentSectionProps) => {
  const dispatch = useAppDispatch()
  const { comments, loading } = useAppSelector((s: RootState) => s.comments)
  const { user } = useAppSelector((s: RootState) => s.auth)
  const [contenu, setContenu] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    dispatch(fetchComments(taskId))
  }, [dispatch, taskId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contenu.trim()) return
    setSending(true)
    await dispatch(createComment({ taskId, contenu: contenu.trim() }))
    setContenu('')
    setSending(false)
  }

  const handleDelete = (commentId: string) => {
    dispatch(deleteComment({ taskId, commentId }))
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    })

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-3">
        Commentaires ({comments.length})
      </p>

      {loading ? (
        <div className="flex justify-center py-4"><Spinner size="sm" /></div>
      ) : (
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              Aucun commentaire pour l'instant
            </p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex gap-2.5 group">
                <Avatar nom={comment.auteur.nom} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-900">
                      {comment.auteur.nom}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                    {user?.id === comment.auteurId && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {comment.contenu}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={contenu}
          onChange={e => setContenu(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-[#5DCAA5] transition-colors"
        />
        <button
          type="submit"
          disabled={sending || !contenu.trim()}
          className="p-2 rounded-xl disabled:opacity-50 transition-opacity"
          style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
        >
          {sending ? <Spinner size="sm" /> : <Send size={14} />}
        </button>
      </form>
    </div>
  )
}