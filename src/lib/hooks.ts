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
export async function fetchMembersForMatching(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, part, university, experience_years, past_matched_ids')

  if (error) {
    console.error('メンバー取得エラー:', error)
    return []
  }

  const members: Member[] = []

  data?.forEach((row) => {
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

