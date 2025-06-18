import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'

type RoomInfo = {
  room_id: string
  band_number: number
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MyBandsPage = () => {
  const [rooms, setRooms] = useState<RoomInfo[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMyBands = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setRooms([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('chat_room_members')
      .select(`
        chat_room_id,
        chat_rooms (
          id,
          band_id,
          bands (
            band_number
          )
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error(error)
      setRooms([])
    } else {
      const formatted = (data || []).map((entry: any) => ({
        room_id: entry.chat_room_id,
        band_number: entry.chat_rooms?.bands?.band_number || 0,
      }))
      setRooms(formatted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMyBands()

    // ✅ Realtimeで bands を listen
    const channel = supabase
      .channel('bands-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bands' }, () => {
        console.log('新しいバンドが追加されました！自動更新！')
        fetchMyBands()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">🎤 自分のバンドチャット一覧</h1>

      {loading ? (
        <p className="text-center text-white/70">読み込み中...</p>
      ) : rooms.length === 0 ? (
        <p className="text-center text-white/70">所属しているバンドがまだありません。</p>
      ) : (
        <div className="max-w-xl mx-auto space-y-4">
          {rooms.map((room) => (
            <Link
              key={room.room_id}
              href={`/chat/${room.room_id}`}
              className="block bg-white/10 backdrop-blur px-4 py-3 rounded-md border border-white/20 hover:brightness-110 transition"
            >
              バンド {room.band_number} のチャットへ →
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProtectedMyBandsPage() {
  return (
    <ProtectedRoute>
      <MyBandsPage />
    </ProtectedRoute>
  )
}
