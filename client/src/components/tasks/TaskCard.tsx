import type { DraggableProvided } from '@hello-pangea/dnd'
import { Pencil, Trash2, MessageSquare, Calendar } from 'lucide-react'
import type { Task, User } from '../../types'
import { Avatar } from '../ui/Avatar'

interface TaskCardProps {
  task: Task
  membres: Pick<User, 'id' | 'nom' | 'avatar'>[]
  provided: DraggableProvided
  isDragging: boolean
  onEdit: () => void
  onDelete: () => void
  onView: () => void
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const isOverdue = (date: string) => new Date(date) < new Date()

export const TaskCard = ({
  task,
  membres,
  provided,
  isDragging,
  onEdit,
  onDelete,
  onView,
}: TaskCardProps) => {
  const assignee = membres.find(m => m.id === task.assigneId)

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="bg-white rounded-xl p-3.5 mb-2 border border-gray-100 group transition-all"
      style={{
        ...provided.draggableProps.style,
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.12)' : undefined,
        opacity: isDragging ? 0.9 : 1,
      }}
      onClick={onView}
    >
      {/* Actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-gray-900 leading-snug flex-1">
          {task.titre}
        </p>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={onEdit}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-2.5 line-clamp-2">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {task.echeance && (
            <div
              className={`flex items-center gap-1 text-xs ${
                isOverdue(task.echeance) && task.statut !== 'DONE'
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}
            >
              <Calendar size={11} />
              {formatDate(task.echeance)}
            </div>
          )}
          {(task._count?.commentaires ?? 0) > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MessageSquare size={11} />
              {task._count?.commentaires}
            </div>
          )}
        </div>

        {assignee && <Avatar nom={assignee.nom} size="sm" />}
      </div>
    </div>
  )
}