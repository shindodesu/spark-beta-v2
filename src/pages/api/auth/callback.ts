// src/pages/api/auth/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase'; // Supabaseクライアントをインポート

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Supabase からリダイレクトされた URL からコードとステートを取得
  const { code, state } = req.query;

  if (code) {
    try {
      // Supabase にコードを渡してセッションを交換
      const { data, error } = await supabase.auth.exchangeCodeForSession(String(code));

      if (error) {
        console.error('Error exchanging code for session:', error.message);
        return res.status(500).json({ error: error.message });
      }

      // 認証成功後、任意のページにリダイレクト
      // 通常はホームページやダッシュボード、あるいはプロフィール作成ページなど
      // ここでは /profile/create にリダイレクトします
      res.redirect('/profile/create');
    } catch (err: unknown) {
      console.error('Unexpected error during code exchange:', err);
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(500).json({ error: 'An unknown error occurred.' });
    }
  } else {
    // コードがない場合はエラー
    return res.status(400).json({ error: 'Authorization code missing.' });
  }
}