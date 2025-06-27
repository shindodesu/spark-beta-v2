import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { generateBands } from '@/lib/matching'
import { fetchMembersForMatching } from '@/lib/hooks'
import type { Member } from '@/types/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { event_id } = req.body
  if (!event_id) {
    return res.status(400).json({ error: 'Missing event_id' })
  }

  try {
    // 既存のバンドとチャットルームを削除（必要に応じて）
    await supabase.from('bands').delete().eq('event_id', event_id)
    await supabase.from('chat_rooms').delete().eq('event_id', event_id)

    const members: Member[] = await fetchMembersForMatching()
    const bands = generateBands(members)

    for (let i = 0; i < bands.length; i++) {
      const band = bands[i]
      const bandNumber = i + 1

      const { data: bandData, error: bandError } = await supabase
        .from('bands')
        .insert({
          event_id,
          band_number: bandNumber,
          members: band.map(m => m.id),
        })
        .select()
        .single()

      if (bandError || !bandData) {
        console.error('Band insert error:', bandError)
        continue
      }

      const { error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          event_id,
          band_id: bandData.id,
          room_name: `Band ${bandNumber}`,
        })
        if (roomError || !bandData.id) {
          console.error('Chat room insert error:', roomError)
          continue
        }

        for (const member of band) {
          const newIds = band
            .map((m) => m.id)
            .filter((id) => id !== member.id)
        
          // 既存の past_matched_ids を取得
          const { data: existing, error: fetchError } = await supabase
            .from('users')
            .select('past_matched_ids')
            .eq('id', member.id)
            .single()
        
          if (fetchError || !existing) continue
        
          const merged = Array.from(new Set([...(existing.past_matched_ids || []), ...newIds]))
        
          await supabase
            .from('users')
            .update({ past_matched_ids: merged })
            .eq('id', member.id)
        }

      if (roomError) {
        console.error('Chat room insert error:', roomError)
        continue

        
      }
      
    }

    return res.status(200).json({ message: 'Matching generated successfully' })

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

