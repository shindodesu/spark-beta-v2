import React, { useEffect, useState } from 'react'
import { generateBands } from '../lib/matching'
import ProtectedRoute from '../components/ProtectedRoute'
import { createClient } from '@supabase/supabase-js'
import {UserRecord} from '@/types/supabase'

type Band = UserRecord[]

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MatchingPage: React.FC = () => {
  const [myBands, setMyBands] = useState<Band[]>([])

  const [loading, setLoading] = useState(true)
  const [myId, setMyId] = useState<string | null>(null)
// generateBands
const generateBands = (members: UserRecord[]): Band[] => {
  // シャッフルして分割
  const shuffled = [...members].sort(() => Math.random() - 0.5)
  const bands: Band[] = []
  const size = 4

  for (let i = 0; i < shuffled.length; i += size) {
    bands.push(shuffled.slice(i, i + size))
  }

  return bands
}
  useEffect(() => {
    const runMatching = async () => {
      setLoading(true)

      // ユーザー取得
      const { data: { user } } = await supabase.auth.getUser()
      setMyId(user?.id ?? null)

      // メンバー取得
      const { data: members, error } = await supabase
        .from('users')
        .select('id, part, university, experience_years, past_matched_ids')
      if (error) throw error

      // 仮バンド生成 & 自分のだけ
      const matchedBands = generateBands(members || [])
      const filtered = matchedBands.filter(band =>
        band.some(member => member.id === user?.id)
      )
      setMyBands(filtered)

      setLoading(false)
    }

    runMatching()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">✨ テスト用：仮マッチング結果 ✨</h1>

      {loading ? (
        <p className="text-center text-white/70">マッチング中...</p>
      ) : myBands.length === 0 ? (
        <p className="text-center text-white/70">あなたが含まれるバンドが見つかりませんでした。</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {myBands.map((band, index) => (
            <div
              key={index}
              className="rounded-xl p-6 bg-white/10 backdrop-blur border border-white/20 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">🎤 バンド {index + 1}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/90">
                {band.map((member) => (
                  <li
                    key={member.id}
                    className={`bg-white/5 p-2 rounded-md border border-white/10 ${
                      member.id === myId ? 'ring-2 ring-pink-400' : ''
                    }`}
                  >
                    <span className="block text-sm">
                      <strong>パート：</strong>{member.part}
                    </span>
                    <span className="block text-sm">
                      <strong>ID：</strong>{member.id}
                    </span>
                    {member.id === myId && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">
                        あなた
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProtectedMatchingPage() {
  return (
    <ProtectedRoute>
      <MatchingPage />
    </ProtectedRoute>
  )
}
