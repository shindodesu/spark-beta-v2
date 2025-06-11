// src/pages/profile/create.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase'; // Supabaseクライアントをインポート
import { useAuth } from '../../lib/hooks'; // 認証状態管理フックをインポート
import ProtectedRoute from '../../components/ProtectedRoute'; // 認証済みルート保護
import ProfileForm from '../../components/ProfileForm'; // プロフィールフォームコンポーネント
import { UserProfile } from '../../types'; // UserProfile 型をインポート

const CreateProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 認証状態の確認は ProtectedRoute で行われるため、ここではロジックを簡素化

  const handleProfileSubmit = async (profileData: UserProfile) => { // user_metadataはany型になりがち
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        setError('ユーザーが認証されていません。再度ログインしてください。');
        router.push('/login'); // 未認証ならログインページへリダイレクト
        return;
      }

      // SupabaseのupdateUserを使ってuser_metadataを更新
      const { error: updateError } = await supabase.auth.updateUser({
        data: profileData, // ここで user_metadata が更新される
      });

      if (updateError) {
        setError(`プロフィールの保存に失敗しました: ${updateError.message}`);
      } else {
        alert('プロフィールが正常に保存されました！');
        router.push('/profile/view'); // プロフィール確認ページへ遷移
      }
    } catch (err: unknown) { // 'any' を 'unknown' に修正
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
        <ProfileForm onSubmit={handleProfileSubmit} isSubmitting={isSubmitting} error={error} />
      </div>
    </ProtectedRoute>
  );
};

export default CreateProfilePage;