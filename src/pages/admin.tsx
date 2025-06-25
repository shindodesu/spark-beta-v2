import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/types/supabase'


export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const ADMIN_EMAIL = 'fjsndesu@gmail.com'

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        alert('管理者のみアクセス可能です')
        router.push('/')
        return
      }

      const { data, error } = await supabase.from('events').select('id, event_name')
      if (error) {
        console.error('イベント取得エラー:', error)
        return
      }

      setEvents(data ?? [])
    }

    init()
  }, [router])

  const handleSaveMatching = async (eventId: string) => {
    setLoading(true)
    setMessage('')
    const res = await fetch('/api/admin/generate-matching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId }),
    })
    const data = await res.json()
    if (res.ok) {
      setMessage(`✅ イベント ${eventId} のマッチング保存 & メール送信完了！`)
    } else {
      setMessage(`❌ エラー: ${data.error}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">🛠 管理者画面（簡易版）</h1>

      {events.map(event => (
        <div key={event.id} className="mb-6 border-b border-white/20 pb-4">
          <p className="text-lg font-semibold mb-2">📅 {event.event_name}</p>
          <button
            onClick={() => handleSaveMatching(event.id)}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {loading ? '保存中...' : '🚀 マッチングを保存 & 通知'}
          </button>
        </div>
      ))}

      {message && (
        <p className="mt-6 text-center text-green-400">{message}</p>
      )}
    </div>
  )
}
