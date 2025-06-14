export type Part = 'Soprano' | 'Alto' | 'Tenor' | 'Baritone' | 'Bass' | 'Vocal_Percussion'

export type Member = {
  id: string
  part: Part
  nickname: string
  university: string
  experience: number // 0〜10スケール
  pastMatchedWith: string[] // IDの配列
}

export type Band = Member[]

// バンドスコアを計算：大学の多様性 + 経験値のバランス - 過去のマッチ被り
export function calculateBandScore(band: Band): number {
  const universitySet = new Set(band.map(m => m.university))

  // 経験年数の標準偏差
  const experienceAvg = band.reduce((sum, m) => sum + m.experience, 0) / band.length
  const experienceStdDev = Math.sqrt(
    band.reduce((sum, m) => sum + Math.pow(m.experience - experienceAvg, 2), 0) / band.length
  )

  // 過去にマッチした相手が同じバンドにいる数をカウント
  const pastMatchPenalty = band.flatMap(m => 
    m.pastMatchedWith.filter(id => band.some(b => b.id === id))
  ).length

  const universityScore = universitySet.size / band.length // 最大1
  const experienceBalanceScore = 1 / (1 + experienceStdDev) // 小さいほど高評価
  const matchPenalty = pastMatchPenalty

  return universityScore * 3 + experienceBalanceScore * 2 - matchPenalty * 2
}

// 全通りからスコア順に良いバンドを選出
export function generateBands(members: Member[]): Band[] {
  const byPart: Record<Part, Member[]> = {
    Soprano: [], Alto: [], Tenor: [], Baritone: [], Bass: [], Vocal_Percussion: []
  }

  for (const m of members) {
    byPart[m.part]?.push(m)
  }

  const possibleBands: Band[] = []

  for (const sop of byPart.Soprano)
  for (const alt of byPart.Alto)
  for (const ten of byPart.Tenor)
  for (const bari of byPart.Baritone)
  for (const bass of byPart.Bass)
  for (const vp of byPart.Vocal_Percussion) {
    const band = [sop, alt, ten, bari, bass, vp]
    const ids = band.map(m => m.id)
    if (new Set(ids).size === 6) {
      possibleBands.push(band)
    }
  }

  possibleBands.sort((a, b) => calculateBandScore(b) - calculateBandScore(a))

  const assigned = new Set<string>()
  const finalBands: Band[] = []

  for (const band of possibleBands) {
    if (band.every(m => !assigned.has(m.id))) {
      band.forEach(m => assigned.add(m.id))
      finalBands.push(band)
    }
  }

  return finalBands
}

import { supabase } from './supabase'
import type { Band } from './matching'

export async function updatePastMatchedIds(bands: Band[]) {
  for (const band of bands) {
    for (const member of band) {
      const others = band.filter((m) => m.id !== member.id).map((m) => m.id)
      const { data, error } = await supabase
        .from('users')
        .select('past_matched_ids')
        .eq('id', member.id)
        .single()

      if (error) continue

      const existing = data?.past_matched_ids || []
      const updated = Array.from(new Set([...existing, ...others]))

      await supabase
        .from('users')
        .update({ past_matched_ids: updated })
        .eq('id', member.id)
    }
  }
}

