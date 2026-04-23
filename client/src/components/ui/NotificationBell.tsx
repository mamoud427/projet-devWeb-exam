import { useState, useEffect } from 'react'
import { Bell, X, Check } from 'lucide-react'
import api from '../../services/api'

interface Notification {
  id: string
  message: string
  lu: boolean
  type: string
  createdAt: string
}

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.data ?? [])
      setUnreadCount(res.data.unreadCount ?? 0)
    } catch {
      // silencieux
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Polling toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAllRead = async () => {
    await api.put('/notifications/read-all')
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })))
    setUnreadCount(0)
  }

  const handleDelete = async (id: string) => {
    await api.delete(`/notifications/${id}`)
    setNotifications(prev => prev.filter(n => n.id !== id))
    setUnreadCount(prev => {
      const notif = notifications.find(n => n.id === id)
      return notif && !notif.lu ? prev - 1 : prev
    })
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    })

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-medium"
            style={{ background: '#E24B4A', fontSize: '10px' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 w-80 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({unreadCount} non lues)
                  </span>
                )}
              </p>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs text-[#5DCAA5] hover:underline"
                >
                  <Check size={11} />
                  Tout marquer lu
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-gray-400">
                  Aucune notification
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      !notif.lu ? 'bg-[#E1F5EE]/30' : ''
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ background: notif.lu ? '#D3D1C7' : '#5DCAA5' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(notif.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="p-0.5 rounded text-gray-300 hover:text-gray-500 transition-colors shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}