// pages/events/[id]/apply.tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'

const ApplyPage = () => {
  const router = useRouter()
  const { id: eventId } = router.query
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventId || !userId) return

    setLoading(true)
    const { error } = await supabase
      .from('event_participants')
      .insert({ event_id: eventId, user_id: userId })

    if (!error) setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-6 py-12">
      <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">イベント参加表明</h1>

        {submitted ? (
          <p className="text-center text-green-400 font-semibold">
            ✅ 参加を表明しました！
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-white/80">
              このイベントに参加したい場合は、下のボタンを押してください。
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:brightness-110 rounded-md font-semibold transition"
            >
              {loading ? '送信中...' : '参加を表明する'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ProtectedApplyPage() {
  return (
    <ProtectedRoute>
      <ApplyPage />
    </ProtectedRoute>
  )
}
