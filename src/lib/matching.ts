import { Member, Band,} from '@/types/supabase'


// バンドスコアを計算：大学の多様性 + 経験値のバランス - 過去のマッチ被り
export function calculateBandScore(band: Band): number {
  const universitySet = new Set(band.map(m => m.university))

  // 経験年数の標準偏差
  const experienceAvg = band.reduce((sum, m) => sum + m.experience_years, 0) / band.length
  const experienceStdDev = Math.sqrt(
    band.reduce((sum, m) => sum + Math.pow(m.experience_years - experienceAvg, 2), 0) / band.length
  )

  // 過去にマッチした相手が同じバンドにいる数をカウント
  const pastMatchPenalty = band.flatMap(m => 
    m.past_matched_ids.filter(id => band.some(b => b.id === id))
  ).length

  const universityScore = universitySet.size / band.length // 最大1
  const experienceBalanceScore = 1 / (1 + experienceStdDev) // 小さいほど高評価
  const matchPenalty = pastMatchPenalty

  return universityScore * 3 + experienceBalanceScore * 2 - matchPenalty * 2
}

// 全通りからスコア順に良いバンドを選出
export function generateBands(members: Member[]): Band[] {
  const byPart: Record<string, Member[]> = {
    Soprano: [], Alto: [], Tenor: [], Baritone: [], Bass: [], Vocal_Percussion: []
  }

  for (const m of members) {
    for (const p of m.part) {
      if (byPart[p]) {
        byPart[p].push(m)
     }
    }
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


export const createChatRoomForEvent = async (eventId: string, userIds: string[]) => {
  // 1) chat_room を作る
  const { data: room, error: roomError } = await supabase
    .from('chat_rooms')
    .insert({
      room_type: 'event',
      related_id: eventId
    })
    .select()
    .single()

  if (roomError) throw roomError

  // 2) chat_room_members に全員登録
  const members = userIds.map(uid => ({
    chat_room_id: room.id,
    user_id: uid
  }))

  const { error: memberError } = await supabase
    .from('chat_room_members')
    .insert(members)

  if (memberError) throw memberError

  return room
}
