// pages/chat/index.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { supabase } from '@/lib/supabase'

type ChatRoom = {
  id: string
  room_type: string
  related_id: string
  created_at: string
}


const ChatListPage = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([])

  useEffect(() => {
    const fetchRooms = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('chat_room_members')
        .select('chat_room_id, chat_rooms(id, room_type, related_id, created_at)')
        .eq('user_id', user.id)

      if (error) {
        console.error(error)
        return
      }

      const uniqueRooms = data?.map(r => r.chat_rooms).flat().filter((room) => room?.room_type === 'band') || []
      setRooms(uniqueRooms)
    }

    fetchRooms()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">参加中のチャットルーム</h1>
      <ul className="max-w-2xl mx-auto space-y-4">
        {rooms.map((room) => (
          <li key={room.id} className="bg-white/10 p-4 rounded-lg backdrop-blur">
            <p className="mb-2">タイプ: {room.room_type}</p>
            <Link
              href={`/chat/${room.id}`}
              className="text-pink-300 hover:text-pink-200 font-semibold"
            >
              ルームを開く →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ProtectedChatListPage() {
  return (
    <ProtectedRoute>
      <ChatListPage />
    </ProtectedRoute>
  )
}
