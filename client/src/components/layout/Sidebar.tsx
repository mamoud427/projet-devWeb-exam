import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Circle, Users, LogOut } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { logout } from '../../store/slices/authSlice'


const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Vue d\'ensemble', end: true },
  { to: '/projects', icon: Circle, label: 'Mes Orbites' },
  { to: '/profile', icon: Users, label: 'Mon Profil' },
]

export const Sidebar = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector(s => s.auth)
  const { projects } = useAppSelector(s => s.projects)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <aside
      className="flex flex-col h-screen w-52 shrink-0"
      style={{ background: 'var(--orbit-sidebar)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'var(--orbit-teal)' }}
        >
          <Circle size={12} style={{ color: '#04342C' }} />
        </div>
        <span className="text-white font-medium tracking-wide">Orbit</span>
      </div>

      {/* Nav principal */}
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'text-[#5DCAA5] bg-[rgba(93,202,165,0.08)]'
                  : 'text-[#888780] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Orbites actives */}
      {projects.length > 0 && (
        <div className="mt-6 px-2">
          <p className="text-xs text-[#444441] uppercase tracking-widest px-3 mb-2">
            Orbites actives
          </p>
          {projects.slice(0, 5).map(p => (
            <NavLink
              key={p.id}
              to={`/projects/${p.id}`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'text-white' : 'text-[#888780] hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: 'var(--orbit-teal)' }}
              />
              <span className="truncate">{p.titre}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-white/5">
        <div className="flex items-center gap-2 px-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
            style={{ background: 'rgba(93,202,165,0.15)', color: 'var(--orbit-teal)' }}
          >
            {user?.nom?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">{user?.nom}</p>
            <p className="text-xs text-[#444441] truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#888780] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut size={14} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}