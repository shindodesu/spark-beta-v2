// /src/types/supabase.ts

export type BandRecord = {
  id: string
  event_id: string
  band_number: number
  members: string[]
}

export type ChatRoomRecord = {
  id: string
  event_id: string
  band_id: string
}

export type CreatedRoom = {
  band_number: number
  room_id: string
}

export type Band = Member[] // ✅ 追加

export type Part = 'Soprano' | 'Alto' | 'Tenor' | 'Baritone' | 'Bass' | 'Vocal_Percussion'

export type Member = {
  id: string
  part: Part[]
  name: string
  university: string
  experience_years: number // 0〜10スケール
  past_matched_ids: string[] // IDの配列
  email?: string // 追加: メンバーのメールアドレス
}

export type BandMember = {
  member: Member
  assignedPart: string
}


 