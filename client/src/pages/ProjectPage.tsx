import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Trash2, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import {
  fetchProjects,
  createProject,
  deleteProject,
} from '../store/slices/projectSlice'
import { Modal } from '../components/ui/Modal'
import { ProjectForm } from '../components/projects/ProjectForm'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Avatar } from '../components/ui/Avatar'

export const ProjectsPage = () => {
  const dispatch = useAppDispatch()
  const { projects, loading } = useAppSelector(s => s.projects)
  const { user } = useAppSelector(s => s.auth)

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    dispatch(fetchProjects({ search }))
  }, [dispatch, search])

  const handleCreate = async (data: { titre: string; description?: string }) => {
    setCreating(true)
    const result = await dispatch(createProject(data))
    setCreating(false)
    if (createProject.fulfilled.match(result)) {
      toast.success('Orbite lancée !')
      setShowCreate(false)
    } else {
      toast.error('Erreur lors de la création')
    }
  }

  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return
    const result = await dispatch(deleteProject(id))
    if (deleteProject.fulfilled.match(result)) {
      toast.success('Orbite supprimée')
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Orbites</h1>
          <p className="text-sm text-gray-500 mt-1">
            {projects.length} projet{projects.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
        >
          <Plus size={14} />
          Nouvelle orbite
        </button>
      </div>

      {/* Recherche */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une orbite..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#5DCAA5] transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="Aucune orbite trouvée"
          description={search ? 'Essayez un autre terme' : 'Créez votre premier projet'}
          action={
            !search ? (
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
              >
                Créer une orbite
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <Link to={`/projects/${project.id}`} className="flex-1">
                  <p className="font-medium text-gray-900 hover:text-[#5DCAA5] transition-colors">
                    {project.titre}
                  </p>
                  {project.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </Link>
                {project.createurId === user?.id && (
                  <div className="flex items-center gap-1 ml-2">
                    <Link
                      to={`/projects/${project.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Pencil size={13} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id, project.titre)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <Avatar nom={project.createur.nom} size="sm" />
                <span className="text-xs text-gray-400">
                  {project._count?.taches ?? 0} missions ·{' '}
                  {project._count?.membres ?? 0} membres
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Lancer une nouvelle orbite"
      >
        <ProjectForm onSubmit={handleCreate} loading={creating} />
      </Modal>
    </div>
  )
}