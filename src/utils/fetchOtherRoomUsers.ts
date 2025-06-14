// utils/fetchOtherRoomUsers.ts
import { supabase } from '@/lib/supabase'

export const fetchOtherRoomUsers = async (roomId: string, currentUserId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('chat_room_members')
    .select('user_id')
    .eq('chat_room_id', roomId)
    .neq('user_id', currentUserId)

  if (error) {
    console.error('他の参加者取得失敗:', error)
    return []
  }

  return data?.map((row) => row.user_id) || []
}
