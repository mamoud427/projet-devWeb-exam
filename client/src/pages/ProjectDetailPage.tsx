import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Users, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchProjectById } from '../store/slices/projectSlice'
import { fetchTasks, updateTask, createTask, deleteTask } from '../store/slices/taskSlice'
import type { RootState } from '../store'
import type { Task, TaskStatus } from '../types'
import { KanbanBoard } from '../components/tasks/KanbanBoard'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { Spinner } from '../components/ui/Spinner'
import { Avatar } from '../components/ui/Avatar'
import { TaskDetailModal } from '../components/tasks/TaskDetailModal'

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const project = useAppSelector((s: RootState) => s.projects.currentProject)
  const { tasks, loading } = useAppSelector((s: RootState) => s.tasks)

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewingTask, setViewingTask] = useState<Task | null>(null)
  const [search, setSearch] = useState('')
  const [filterAssigne, setFilterAssigne] = useState('')

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
      dispatch(fetchTasks(id))
    }
  }, [dispatch, id])

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.titre.toLowerCase().includes(search.toLowerCase())
    const matchAssigne = filterAssigne ? t.assigneId === filterAssigne : true
    return matchSearch && matchAssigne
  })

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    if (!id) return
    const result = await dispatch(updateTask({
      projectId: id,
      taskId,
      data: { statut: newStatus },
    }))
    if (updateTask.fulfilled.match(result)) {
      toast.success('Statut mis à jour')
    }
  }

  const handleCreateTask = async (data: Partial<Task>) => {
    if (!id) return
    const result = await dispatch(createTask({ projectId: id, data }))
    if (createTask.fulfilled.match(result)) {
      toast.success('Mission créée !')
      setShowTaskForm(false)
    } else {
      toast.error('Erreur lors de la création')
    }
  }

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!id || !editingTask) return
    const result = await dispatch(updateTask({
      projectId: id,
      taskId: editingTask.id,
      data,
    }))
    if (updateTask.fulfilled.match(result)) {
      toast.success('Mission mise à jour')
      setEditingTask(null)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!id || !confirm('Supprimer cette mission ?')) return
    const result = await dispatch(deleteTask({ projectId: id, taskId }))
    if (deleteTask.fulfilled.match(result)) {
      toast.success('Mission supprimée')
    }
  }

  if (loading && !project) return (
    <div className="flex items-center justify-center h-full">
      <Spinner size="lg" />
    </div>
  )

  if (!project) return (
    <div className="p-8 text-gray-500">Projet introuvable.</div>
  )

  const membres = project.membres?.map(m => m.user) ?? []

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-lg font-medium text-gray-900">{project.titre}</h1>
              {project.description && (
                <p className="text-sm text-gray-500 mt-0.5">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Membres */}
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-gray-400" />
              <div className="flex">
                {project.membres?.slice(0, 4).map(m => (
                  <div key={m.user.id} className="-ml-1.5 first:ml-0">
                    <Avatar nom={m.user.nom} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
            >
              <Plus size={14} />
              Nouvelle mission
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une mission..."
              className="w-full pl-8 pr-4 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-[#5DCAA5] transition-colors"
            />
          </div>
          <select
            value={filterAssigne}
            onChange={e => setFilterAssigne(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:border-[#5DCAA5] transition-colors"
          >
            <option value="">Tous les membres</option>
            {membres.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>

        {/* Stats rapides */}
        <div className="flex items-center gap-4 mt-4">
          {[
            { label: 'Total', count: tasks.length, color: '#888780' },
            { label: 'À faire', count: tasks.filter(t => t.statut === 'TODO').length, color: '#7F77DD' },
            { label: 'En cours', count: tasks.filter(t => t.statut === 'IN_PROGRESS').length, color: '#EF9F27' },
            { label: 'Terminé', count: tasks.filter(t => t.statut === 'DONE').length, color: '#5DCAA5' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
              <span className="text-xs text-gray-500">{stat.label}</span>
              <span className="text-xs font-medium text-gray-900">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            membres={project.membres?.map(m => m.user) ?? []}
            onStatusChange={handleStatusChange}
            onEditTask={(task) => setEditingTask(task)}
            onDeleteTask={handleDeleteTask}
            onViewTask={(task) => setViewingTask(task)}
          />
        )}
      </div>

      {/* Modal création tâche */}
      {showTaskForm && (
        <TaskFormModal
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
          membres={project.membres?.map(m => m.user) ?? []}
          title="Nouvelle mission"
        />
      )}

      {/* Modal édition tâche */}
      {editingTask && (
        <TaskFormModal
          onSubmit={handleUpdateTask}
          onClose={() => setEditingTask(null)}
          membres={project.membres?.map(m => m.user) ?? []}
          defaultValues={editingTask}
          title="Modifier la mission"
          submitLabel="Mettre à jour"
        />
      )}

      {viewingTask && (
        <TaskDetailModal
          task={viewingTask}
          membres={membres}
          onClose={() => setViewingTask(null)}
          onEdit={() => { setEditingTask(viewingTask); setViewingTask(null) }}
        />
      )}
    </div>
  )
}