import type { DroppableProvided } from '@hello-pangea/dnd'
import { Draggable } from '@hello-pangea/dnd'
import type { Task, User } from '../../types'
import { TaskCard } from './TaskCard'

interface ColumnDef {
  id: string
  label: string
  color: string
}

interface KanbanColumnProps {
  column: ColumnDef
  tasks: Task[]
  membres: Pick<User, 'id' | 'nom' | 'avatar'>[]
  provided: DroppableProvided
  isDraggingOver: boolean
  draggingId: string | null
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export const KanbanColumn = ({
  column,
  tasks,
  membres,
  provided,
  isDraggingOver,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header colonne */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: column.color }} />
        <span className="text-sm font-medium text-gray-700">{column.label}</span>
        <span
          className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${column.color}20`, color: column.color }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Zone de drop */}
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="flex-1 rounded-2xl p-2 overflow-y-auto transition-colors"
        style={{
          background: isDraggingOver ? `${column.color}08` : '#F8F8F7',
          border: `1.5px dashed ${isDraggingOver ? column.color : 'transparent'}`,
          minHeight: '200px',
        }}
      >
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <TaskCard
                task={task}
                membres={membres}
                provided={provided}
                isDragging={snapshot.isDragging}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            )}
          </Draggable>
        ))}
        {provided.placeholder}

        {tasks.length === 0 && !isDraggingOver && (
          <div className="flex items-center justify-center h-24 text-xs text-gray-400">
            Aucune mission
          </div>
        )}
      </div>
    </div>
  )
}