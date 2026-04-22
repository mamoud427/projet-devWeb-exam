import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Circle, TrendingUp } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchProjects } from '../store/slices/projectSlice'
import type { RootState } from '../store'
import { Spinner } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { EmptyState } from '../components/ui/EmptyState'
import { StatChart } from '../components/ui/StatChart'

export const DashboardPage = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s: RootState) => s.auth.user)
  const { projects, loading, pagination } = useAppSelector((s: RootState) => s.projects)

  useEffect(() => { dispatch(fetchProjects({})) }, [dispatch])

  const totalTaches = projects.reduce((acc, p) => acc + (p._count?.taches ?? 0), 0)
  const tauxCompletion = projects.length > 0
    ? Math.round((projects.filter(p => (p._count?.taches ?? 0) > 0).length / projects.length) * 100)
    : 0

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Centre de contrôle</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bonjour, {user?.nom?.split(' ')[0]} 👋
          </p>
        </div>
        <Link
          to="/projects"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
        >
          <Plus size={14} />
          Nouvelle orbite
        </Link>
      </div>

      {/* Stats + Graphique */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="col-span-3 grid grid-cols-3 gap-4">
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

          {/* Projets récents */}
          <div className="col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-900">Orbites récentes</h2>
              <Link to="/projects" className="text-xs text-[#5DCAA5] hover:underline">
                Voir tout
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : projects.length === 0 ? (
              <EmptyState
                title="Aucune orbite pour l'instant"
                description="Créez votre premier projet"
                icon={<Circle size={20} />}
                action={
                  <Link
                    to="/projects"
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
                  >
                    Créer une orbite
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {projects.slice(0, 3).map(project => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                        style={{ background: '#E1F5EE' }}
                      >
                        🌍
                      </div>
                      <Badge variant="success">Actif</Badge>
                    </div>
                    <p className="font-medium text-gray-900 text-sm mb-1 truncate">
                      {project.titre}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Avatar nom={project.createur.nom} size="sm" />
                      <span className="text-xs text-gray-400">
                        {project._count?.taches ?? 0} missions
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Graphique */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-gray-400" />
            <p className="text-sm font-medium text-gray-900">Répartition</p>
          </div>
          <StatChart
            todo={projects.reduce((acc, p) => acc + (p._count?.taches ?? 0), 0)}
            inProgress={0}
            done={0}
          />
          <p className="text-xs text-gray-400 text-center mt-2">
            Basé sur {projects.length} orbite{projects.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}