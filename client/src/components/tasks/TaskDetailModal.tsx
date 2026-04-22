import { X, Calendar, User } from 'lucide-react'
import type { Task, User as UserType } from '../../types'
import { CommentSection } from './CommentSection'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'

interface TaskDetailModalProps {
  task: Task
  membres: Pick<UserType, 'id' | 'nom' | 'avatar'>[]
  onClose: () => void
  onEdit: () => void
}

const statusConfig = {
  TODO: { label: 'À faire', variant: 'info' as const },
  IN_PROGRESS: { label: 'En cours', variant: 'warning' as const },
  DONE: { label: 'Terminé', variant: 'success' as const },
}

export const TaskDetailModal = ({
  task,
  membres,
  onClose,
  onEdit,
}: TaskDetailModalProps) => {
  const assignee = membres.find(m => m.id === task.assigneId)
  const status = statusConfig[task.statut]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <h2 className="text-base font-medium text-gray-900">{task.titre}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Infos */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
          {assignee && (
            <div className="flex items-center gap-2">
              <User size={13} className="text-gray-400" />
              <span className="text-xs text-gray-500">Assigné à</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <Avatar nom={assignee.nom} size="sm" />
                <span className="text-xs font-medium text-gray-700">{assignee.nom}</span>
              </div>
            </div>
          )}
          {task.echeance && (
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-gray-400" />
              <span className="text-xs text-gray-500">Échéance</span>
              <span className="text-xs font-medium text-gray-700 ml-auto">
                {new Date(task.echeance).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
        </div>

        {/* Commentaires */}
        <div className="border-t border-gray-100 pt-4">
          <CommentSection taskId={task.id} />
        </div>
      </div>
    </div>
  )
}