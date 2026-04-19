import { Outlet } from 'react-router-dom'
import { Circle } from 'lucide-react'

export const AuthLayout = () => (
  <div
    className="min-h-screen flex"
    style={{ background: 'var(--orbit-sidebar)' }}
  >
    {/* Panel gauche */}
    <div className="hidden lg:flex flex-col justify-between w-96 p-10">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'var(--orbit-teal)' }}
        >
          <Circle size={14} style={{ color: '#04342C' }} />
        </div>
        <span className="text-white text-lg font-medium">Orbit</span>
      </div>
      <div>
        <p className="text-2xl font-medium text-white leading-relaxed mb-3">
          Gérez vos projets comme des missions spatiales.
        </p>
        <p className="text-sm" style={{ color: 'var(--orbit-sidebar-text)' }}>
          Plateforme de collaboration pour les équipes Digital Solutions.
        </p>
      </div>
      <p className="text-xs" style={{ color: '#444441' }}>
        © 2025 Digital Solutions
      </p>
    </div>

    {/* Panel droit */}
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  </div>
)