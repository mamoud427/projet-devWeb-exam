import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Circle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchProjects } from '../store/slices/projectSlice'
import { Spinner } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { EmptyState } from '../components/ui/EmptyState'

export const DashboardPage = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(s => s.auth)
  const { projects, loading, pagination } = useAppSelector(s => s.projects)

  useEffect(() => { dispatch(fetchProjects({})) }, [dispatch])

  const totalTaches = projects.reduce((acc, p) => acc + (p._count?.taches ?? 0), 0)
  const tauxCompletion = projects.length > 0
    ? Math.round((projects.filter(p => (p._count?.taches ?? 0) > 0).length / projects.length) * 100)
    : 0

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Centre de contrôle
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bonjour, {user?.nom?.split(' ')[0]} 👋
          </p>
        </div>
        <Link
          to="/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
        >
          <Plus size={14} />
          Nouvelle orbite
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Orbites actives', value: pagination?.total ?? projects.length, color: '#5DCAA5' },
          { label: 'Missions totales', value: totalTaches, color: '#7F77DD' },
          { label: 'Taux de complétion', value: `${tauxCompletion}%`, color: '#EF9F27' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-2xl font-medium text-gray-900">{stat.value}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Projets */}
      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="Aucune orbite pour l'instant"
          description="Créez votre premier projet pour commencer"
          icon={<Circle size={20} />}
          action={
            <Link
              to="/projects/new"
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
            >
              Créer une orbite
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {projects.map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors block"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ background: 'var(--orbit-teal-light)' }}
                >
                  🌍
                </div>
                <Badge variant="success">Actif</Badge>
              </div>
              <p className="font-medium text-gray-900 mb-1">{project.titre}</p>
              {project.description && (
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Avatar nom={project.createur.nom} size="sm" />
                </div>
                <span className="text-xs text-gray-400">
                  {project._count?.taches ?? 0} missions
                </span>
              </div>
            </Link>
          ))}

          {/* Carte nouvelle orbite */}
          <Link
            to="/projects/new"
            className="border border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-colors min-h-40"
          >
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
              +
            </div>
            <span className="text-sm text-gray-400">Lancer une orbite</span>
          </Link>
        </div>
      )}
    </div>
  )
}