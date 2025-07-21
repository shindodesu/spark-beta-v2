// lib/hooks.ts
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Member, Part } from '@/types/supabase'; ;



export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // 初回ロード時にユーザー情報を取得
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};

//メンバー情報をチェックするフック
export async function fetchMembersForMatching(event_id: string): Promise<Member[]> {
  const { data: participants } = await supabase
  .from('event_participants')
  .select('user_id')
  .eq('event_id', event_id)

const userIds = participants?.map(p => p.user_id) ?? []

// 2. users テーブルから詳細を取得
const { data: users } = await supabase
  .from('users')
  .select('*')
  .in('id', userIds)

return users as Member[]

  const members: Member[] = []

  users?.forEach((row) => {
    if (!row.part || !Array.isArray(row.part)) return

    for (const part of row.part as Part[]) {
      members.push({
        id: row.id,
        part: [part],
        name : row .id,
        university: row.university ?? '不明',
        experience_years: row.experience_years ?? 0,
        past_matched_ids: row.past_matched_ids ?? [],
      })
    }
  })

  return members
}

