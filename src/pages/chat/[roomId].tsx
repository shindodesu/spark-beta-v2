// pages/chat/[roomId].tsx
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import { fetchOtherRoomUsers } from '@/utils/fetchOtherRoomUsers'

type Message = {
  id: string
  chat_room_id: string
  sender_id: string
  content: string
  created_at: string
}

const ChatRoom = () => {
  const router = useRouter()
  const { roomId } = router.query
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [userNames, setUserNames] = useState<Record<string, string>>({})
  const [myPart, setMyPart] = useState<string | null>(null)
  




  //担当パートの取得
  useEffect(() => {
    const fetchMyPart = async () => {
      if (!roomId || typeof roomId !== 'string' || !userId) return
  
      // chat_room から band_id を取得
      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .select('band_id')
        .eq('id', roomId)
        .single()
  
      if (roomError || !roomData?.band_id) return
  
      const bandId = roomData.band_id
  
      // band から members[] を取得
      const { data: bandData, error: bandError } = await supabase
        .from('bands')
        .select('members')
        .eq('id', bandId)
        .single()
  
      if (bandError || !bandData?.members) return
  
      const parts = ['Soprano', 'Alto', 'Tenor', 'Baritone', 'Bass', 'Vocal_Percussion']
      const myIndex = bandData.members.findIndex((id: string) => id === userId)
  
      if (myIndex >= 0) {
        setMyPart(parts[myIndex])
      }
    }
  
    fetchMyPart()
  }, [roomId, userId])
  




  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (!roomId || typeof roomId !== 'string') return
  // ユーザー名を取得
    const fetchUserNames = async () => {
      const userIds = Array.from(new Set(messages.map((msg) => msg.sender_id)))
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .in('id', userIds)
  
      if (!error && data) {
        const nameMap: Record<string, string> = {}
        data.forEach((u) => {
          nameMap[u.id] = u.name
        })
        setUserNames(nameMap)
      }
    }
  
    fetchUserNames()
  }, [messages, roomId])

  
  

  useEffect(() => {
    if (!roomId || typeof roomId !== 'string') return


    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_room_id', roomId)
        .order('created_at', { ascending: true })
      if (!error) setMessages(data || [])
    }

    loadMessages()

    const channel = supabase
      .channel('chat-room-' + roomId)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !userId || typeof roomId !== 'string') return

    // メッセージ送信
    const { error } = await supabase.from('messages').insert({
      chat_room_id: roomId,
      sender_id: userId,
      content: input.trim(),
    })

    if (!error) {
      // 🔔 他の参加者に通知を送る
      const others = await fetchOtherRoomUsers(roomId, userId)
      await Promise.all(
        others.map((uid) =>
          supabase.from('notifications').insert({
            user_id: uid,
            message: '新しいメッセージがあります',
            link: `/chat/${roomId}`,
          })
        )
      )
    }

    

    setInput('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white flex flex-col">
      <div className="flex-grow overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-3">
        <div className="bg-white/10 text-sm text-white p-4 rounded-lg mb-6 shadow-md backdrop-blur">
        👋 バンドメンバーの皆さん、こんにちは！<br />
        このチャットは<strong>初回の顔合わせ調整</strong>にご活用ください。<br />
        <br />
        📝 あなたの担当パート：<strong>{myPart ?? '読み込み中...'}</strong><br />
        <br />
        📝 おすすめステップ：<br />
        1. <strong>まずは自己紹介</strong>（名前、担当パート、好きな音楽など）<br />
        2. <strong>調整さん等で日程調整</strong><br />
        3. <strong>Zoomで顔合わせ</strong><br />
        4. <strong>LINEグループを作成して以降の連絡へ</strong><br />
        <br />
        積極的に自己紹介をして、みんなで楽しいバンド活動を始めましょう！<br />
        <br />
        💬 もしLINEが難しい場合は、このチャット内でやりとりを続けても大丈夫です！
        </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg max-w-xs ${
                msg.sender_id === userId
                  ? 'bg-pink-500 text-white self-end ml-auto'
                  : 'bg-white/10 text-white backdrop-blur'
              }`}
            >
              {/* あだ名を表示 */}
    {msg.sender_id !== userId && (
      <p className="text-xs text-pink-300 font-semibold mb-1">
        {userNames[msg.sender_id] || '???'}
      </p>
    )}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className="text-[10px] text-white/50 mt-1 text-right">
                {new Date(msg.created_at).toLocaleTimeString('ja-JP')}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur p-4 sticky bottom-0 w-full">
        <div className="max-w-2xl mx-auto flex space-x-2">
          <textarea
            className="flex-grow px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="メッセージを入力..."
            value={input}
            onChange={(e) => {setInput(e.target.value)
              e.target.style.height = 'auto'  // これで縮む
              e.target.style.height = `${e.target.scrollHeight}px`  // 入力に応じて伸びる}
            }}
            rows={1}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 rounded-md text-white font-semibold hover:brightness-110"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ProtectedChatRoomPage() {
  return (
    <ProtectedRoute>
      <ChatRoom />
    </ProtectedRoute>
  )
}
