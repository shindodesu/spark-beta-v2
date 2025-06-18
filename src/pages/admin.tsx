// ⚙️ 改良版: admin.tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { generateBands } from '@/lib/matching'
import type { Member, Band } from '@/types/supabase'
import type { Part } from '@/types/supabase'

const ROLES = [
  "Soprano",
  "Alto",
  "Tenor",
  "Baritone",
  "Bass",
  "Vocal_Percussion",
];

type Event = {
  id: string
  event_name: string
}

const partColorMap: Record<Part, string> = {
  Soprano: "bg-pink-600",
  Alto: "bg-purple-600",
  Tenor: "bg-yellow-600",
  Baritone: "bg-green-600",
  Bass: "bg-blue-600",
  Vocal_Percussion: "bg-red-600",
}




export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [checking, setChecking] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [membersByEvent, setMembersByEvent] = useState<Record<string, Member[]>>({})
  const [bandsByEvent, setBandsByEvent] = useState<Record<string, Band[]>>({})
  const router = useRouter()

  const ADMIN_EMAIL = 'fjsndesu@gmail.com'

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        alert('管理者のみアクセス可能です')
        router.push('/')
      } else {
        setChecking(false)
        fetchEvents()
      }
    }

    const fetchEvents = async () => {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, event_name')

      if (eventsError) {
        console.error('イベント取得エラー:', eventsError)
      } else {
        setEvents(eventsData as Event[])
        const allMembers: Record<string, Member[]> = {}
        for (const event of eventsData) {
          const { data: participantsData, error: participantsError } = await supabase
            .from('event_participants')
            .select('user_id, users(id, name, part, university, experience_years, past_matched_ids, email)')
            .eq('event_id', event.id)
          if (participantsError) {
            console.error(`参加者取得エラー (イベント ${event.event_name}):`, participantsError)
          } else {
            const members = participantsData.map((p: any) => p.users) as Member[]
            allMembers[event.id] = members
          }
        }
        setMembersByEvent(allMembers)
      }
    }

    checkAdmin()
  }, [router])

  const handleGenerateCandidates = (eventId: string) => {
    const members = membersByEvent[eventId] || []
    const candidateBands = generateBands(members)
    setBandsByEvent(prev => ({ ...prev, [eventId]: candidateBands }))
  }

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
      setMessage(`✅ イベント ${eventId} のマッチング保存成功 & メール送信済み！`)
    } else {
      setMessage(`❌ エラー: ${data.error}`)
    }
    setLoading(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        アクセス確認中...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">⚙️ 全イベント管理者画面</h1>

      {events.map(event => (
        <div key={event.id} className="mb-16 border-b border-white/30 pb-10">
          <h2 className="text-2xl font-bold mb-6 text-white">📅 {event.event_name}</h2>

          <h3 className="text-xl mb-3">📋 参加メンバー</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-white/20 text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="border px-4 py-2">名前</th>
                  <th className="border px-4 py-2">パート</th>
                  <th className="border px-4 py-2">大学</th>
                  <th className="border px-4 py-2">経験年数</th>
                  <th className="border px-4 py-2">メール</th>
                </tr>
              </thead>
              <tbody>
                {(membersByEvent[event.id] || []).map(member => (
                  <tr key={member.id} className="hover:bg-white/5">
                    <td className="border px-4 py-2">{member.name}</td>
                    <td className="border px-4 py-2">
  <div className="flex flex-wrap gap-1">
    {Array.isArray(member.part) &&
      member.part.map((p) => (
        <span
          key={p}
          className="inline-block bg-slate-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
        >
          {p}
        </span>
      ))}
  </div>
</td>
                    <td className="border px-4 py-2">{member.university}</td>
                    <td className="border px-4 py-2 text-center">{member.experience_years}</td>
                    <td className="border px-4 py-2">{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => handleGenerateCandidates(event.id)}
            className="px-6 py-3 mb-6 rounded-md bg-green-600 text-white font-bold hover:bg-green-700"
          >
            ✅ このイベントのマッチ候補を生成
          </button>

          {bandsByEvent[event.id] && bandsByEvent[event.id].length > 0 && (
            <div className="overflow-x-auto border border-white/20 p-4 rounded-md bg-white/5">
              <h3 className="text-xl mb-4 text-green-400">🎸 生成されたバンド候補</h3>
              {bandsByEvent[event.id].map((band, index) => (
                <div key={index} className="mb-6">
                  <h4 className="font-semibold mb-2 text-white">バンド {index + 1}</h4>
                  <table className="min-w-full border border-white/20 text-sm">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="border px-4 py-2">名前</th>
                        <th className="border px-4 py-2">このバンドの役割</th>
                        <th className="border px-4 py-2">大学</th>
                        <th className="border px-4 py-2">経験年数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {band.map((member, idx) => (
                        <tr key={member.id} className="hover:bg-white/5">
                          <td className="border px-4 py-2">{member.name}</td>
                          <td className="border px-4 py-2">{ROLES[idx]}</td>
                          <td className="border px-4 py-2">{member.university}</td>
                          <td className="border px-4 py-2 text-center">{member.experience_years}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => handleSaveMatching(event.id)}
            disabled={loading}
            className="px-8 py-4 mt-4 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '保存中...' : '🚀 このイベントのマッチングを保存 & メール送信'}
          </button>
        </div>
      ))}

      {message && (
        <p className="mt-10 text-center text-lg text-green-400 font-semibold">{message}</p>
      )}
    </div>
  )
}
