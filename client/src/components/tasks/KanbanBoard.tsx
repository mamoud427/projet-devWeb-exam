import { useState } from 'react'
import { DragDropContext, Droppable} from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import type { Task, TaskStatus, User } from '../../types'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  tasks: Task[]
  membres: Pick<User, 'id' | 'nom' | 'avatar'>[]
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onViewTask?: (task: Task) => void
}

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'TODO', label: 'À faire', color: '#7F77DD' },
  { id: 'IN_PROGRESS', label: 'En cours', color: '#EF9F27' },
  { id: 'DONE', label: 'Terminé', color: '#5DCAA5' },
]

export const KanbanBoard = ({
  tasks,
  membres,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onViewTask,
}: KanbanBoardProps) => {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const handleDragEnd = (result: DropResult) => {
    setDraggingId(null)
    if (!result.destination) return
    const newStatus = result.destination.droppableId as TaskStatus
    const taskId = result.draggableId
    const task = tasks.find(t => t.id === taskId)
    if (task && task.statut !== newStatus) {
      onStatusChange(taskId, newStatus)
    }
  }

  return (
    <DragDropContext
      onDragStart={(start) => setDraggingId(start.draggableId)}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-4 h-full">
        {columns.map(col => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided, snapshot) => (
              <KanbanColumn
                column={col}
                tasks={tasks.filter(t => t.statut === col.id)}
                membres={membres}
                provided={provided}
                isDraggingOver={snapshot.isDraggingOver}
                draggingId={draggingId}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onViewTask={onViewTask}
              />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}