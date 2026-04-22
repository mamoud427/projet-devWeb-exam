import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning'
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) => {
  if (!isOpen) return null

  const colors = {
    danger: { icon: '#A32D2D', bg: '#FCEBEB', btn: '#E24B4A' },
    warning: { icon: '#854F0B', bg: '#FAEEDA', btn: '#EF9F27' },
  }

  const c = colors[variant]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: c.bg }}
        >
          <AlertTriangle size={18} style={{ color: c.icon }} />
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: c.btn }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}