// /pages/api/matching.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Supabase クライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// メンバーの型
type Member = {
  id: string
}

// リクエストBodyの型
type BandsRequestBody = {
  bands: Member[][]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // フロントから送られた bands を取得
    const { bands } = req.body as BandsRequestBody

    if (!bands || !Array.isArray(bands)) {
      return res.status(400).json({ error: 'Invalid bands data' })
    }

    // 全バンド処理
    for (const band of bands) {
      // 1️⃣ chat_rooms を作成
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({})
        .select()
        .single()

      if (roomError) throw roomError

      // 2️⃣ band の各メンバーの past_matched_ids を更新
      for (const member of band) {
        // ユーザー取得
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('past_matched_ids')
          .eq('id', member.id)
          .single<{ past_matched_ids: string[] | null }>()

        if (userError) throw userError

        const updatedPastMatchedIds = Array.isArray(user.past_matched_ids)
          ? [...user.past_matched_ids, ...band.map((m) => m.id).filter((id) => id !== member.id)]
          : band.map((m) => m.id).filter((id) => id !== member.id)

        const { error: updateError } = await supabase
          .from('users')
          .update({ past_matched_ids: updatedPastMatchedIds })
          .eq('id', member.id)

        if (updateError) throw updateError
      }

      // 3️⃣ chat_room_members に band メンバーを追加
      const membersToInsert = band.map((member) => ({
        chat_room_id: room.id,
        user_id: member.id,
      }))

      const { error: membersError } = await supabase
        .from('chat_room_members')
        .insert(membersToInsert)

      if (membersError) throw membersError
    }

    return res.status(200).json({ message: 'Matching and chat rooms saved successfully' })
  } catch (error) {
    console.error('Error saving matching:', error)
    const err = error as { message?: string }
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}
