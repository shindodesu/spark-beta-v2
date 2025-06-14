// pages/matching.tsx
import React, { useEffect, useState } from 'react'
import { fetchMembersForMatching } from '../lib/hooks'
import { generateBands, Band } from '../lib/matching'


const MatchingPage: React.FC = () => {
  const [bands, setBands] = useState<Band[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runMatching = async () => {
      setLoading(true)
      const members = await fetchMembersForMatching()
      const matchedBands = generateBands(members)
      setBands(matchedBands)
      setLoading(false)
    }

    runMatching()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">✨ 仮マッチング結果 ✨</h1>

      {loading ? (
        <p className="text-center text-white/70">マッチング中...</p>
      ) : bands.length === 0 ? (
        <p className="text-center text-white/70">条件に合うバンドが見つかりませんでした。</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {bands.map((band, index) => (
            <div key={index} className="rounded-xl p-6 bg-white/10 backdrop-blur border border-white/20 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">🎤 バンド {index + 1}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/90">
                {band.map((member) => (
                  <li key={member.id + member.part} className="bg-white/5 p-2 rounded-md border border-white/10">
                    <span className="block text-sm">
                      <strong>パート：</strong>{member.part}
                    </span>
                    <span className="block text-sm">
                      <strong>あだ名：</strong>{member.id}
                    </span>
                    <span className="block text-sm">
                      <strong>大学：</strong>{member.university || '不明'}
                    </span>
                    <span className="block text-sm">
                      <strong>経験：</strong>{member.experience} 年目
                    </span>
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

export default MatchingPage ;
