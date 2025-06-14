// pages/notifications.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'

type Notification = {
  id: string
  message: string
  link: string
  is_read: boolean
  created_at: string
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setNotifications(data || [])
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">通知一覧</h1>
      <ul className="max-w-2xl mx-auto space-y-4">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`p-4 rounded-lg border ${
              n.is_read ? 'border-white/10' : 'border-pink-400'
            } bg-white/10 backdrop-blur-md`}
          >
            <Link
              href={n.link || '#'}
              onClick={() => markAsRead(n.id)}
              className="text-white hover:text-pink-300 font-semibold block"
            >
              {n.message}
              <span className="block text-xs text-white/50 mt-1">
                {new Date(n.created_at).toLocaleString('ja-JP')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ProtectedNotificationPage() {
  return (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  )
}
