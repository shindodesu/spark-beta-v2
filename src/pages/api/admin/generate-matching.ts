import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { generateBands } from '@/lib/matching'
import { fetchMembersForMatching } from '@/lib/hooks'
import type { Member, BandRecord, ChatRoomRecord } from '@/types/supabase'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { event_id } = req.body
  if (!event_id) {
    res.status(400).json({ error: 'Missing event_id' })
    return
  }

  try {
    const safeMembers: Member[] = await fetchMembersForMatching()
    const bands = generateBands(safeMembers)

    for (let i = 0; i < bands.length; i++) {
      const band = bands[i]
      const bandNumber = i + 1

      const { data: bandData, error: bandError } = await supabase
        .from('bands')
        .insert({
          event_id,
          band_number: bandNumber,
          members: band.map(m => m.id)
        })
        .select()
        .single<BandRecord>()

      if (bandError) throw bandError

      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({
          event_id,
          band_id: bandData.id
        })
        .select()
        .single<ChatRoomRecord>()

      if (roomError) throw roomError

      const membersToInsert = band.map(member => ({
        chat_room_id: room.id,
        user_id: member.id
      }))

      const { error: membersError } = await supabase
        .from('chat_room_members')
        .insert(membersToInsert)

      if (membersError) throw membersError
    }

    // ✅ Gmail SMTP で一括送信
    const emails = safeMembers.map(m => m.email).filter(Boolean) as string[]
    const nodemailer = require('nodemailer')

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: emails, // 一括送信
      subject: '【Spark β】マッチング結果のお知らせ',
      text: 'マッチング結果が決定しました！詳細はマイページからご確認ください。',
      html: `<p>マッチング結果が決定しました！<br>詳細はマイページからご確認ください。</p>`,
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: '✅ マッチング生成 & Gmail SMTPで送信 完了！' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
}
