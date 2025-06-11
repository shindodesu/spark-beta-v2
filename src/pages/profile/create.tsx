// src/pages/profile/create.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase'; // Supabaseクライアントをインポート
import { useAuth } from '../../lib/hooks'; // 認証状態管理フックをインポート
import ProtectedRoute from '../../components/ProtectedRoute'; // 認証済みルート保護
import ProfileForm from '../../components/ProfileForm'; // プロフィールフォームコンポーネント
import { User } from '../../types'; // UserProfile 型をインポート

const CreateProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialProfileData, setInitialProfileData] = useState<Omit<User, 'id' | 'email' > | undefined>(undefined); 
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);

  // 既存のプロフィールデータを取得
  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!user) {
        setIsFetchingInitialData(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('name, real_name, part, experience_years, region, bio')
        .eq('id', user.id)
        .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116は「見つからなかった」エラー
          setError(`プロフィールの取得に失敗しました: ${fetchError.message}`);
        } else if (data) {
          setInitialProfileData({
            nickname: data.name, // name -> nickname
            real_name: data.real_name,
            part: data.part,
            experience_Years: data.experience_years,
            region: data.region,
            bio: data.bio});
        }
        setIsFetchingInitialData(false);
      };
  
      if (!loading && user) {
        fetchExistingProfile();
      }
    }, [user, loading]);

  // 認証状態の確認は ProtectedRoute で行われるため、ここではロジックを簡素化

  const handleProfileSubmit = async (profileData: Omit<User, 'id' | 'email'>) => { // 引数型を修正
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        setError('ユーザーが認証されていません。再度ログインしてください。');
        router.push('/login'); // 未認証ならログインページへリダイレクト
        return;
      }

      // public.users テーブルを更新または挿入 (upsert)
      const { error: upsertError } = await supabase
        .from('users')
        .upsert(
          {
            id: user.id, // user_id を追加
            name: profileData.nickname, // public.users の name カラムに対応
            real_name: profileData.real_name,
            part: profileData.part,
            region: profileData.region,
            experience_years: profileData.experience_Years,
            bio: profileData.bio,
            email: user.email, // email も users テーブルに保存する場合
          },
          { onConflict: 'id' } // id が競合したら更新
        )
        .select(); // 更新後のデータを取得

        if (upsertError) {
          setError(`プロフィールの保存に失敗しました: ${upsertError.message}`);
        } else {
          alert('プロフィールが正常に保存されました！');
          router.push('/profile/view'); // プロフィール確認ページへ遷移
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`予期せぬエラーが発生しました: ${err.message}`);
        } else {
          setError(`予期せぬエラーが発生しました: ${String(err)}`);
        }
      } finally {
        setIsSubmitting(false);
      }
    };

  // ローディング中は何も表示しないか、ローディングスピナーを表示
  if (loading) {
    return <p>Loading authentication state...</p>;
  }

  // ProtectedRouteがリダイレクトを処理するため、ここでは認証済みであることを前提にフォームを表示
  return (
    <ProtectedRoute>
      <Head>
        <title>Spark β - プロフィール作成</title>
        <meta name="description" content="プロフィール入力ページ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ProfileForm initialData={initialProfileData} onSubmit={handleProfileSubmit} isSubmitting={isSubmitting} error={error} />
      </div>
    </ProtectedRoute>
  );
};

export default CreateProfilePage;