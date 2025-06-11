// src/pages/profile/view.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { supabase } from '../../lib/supabase'; // Supabaseクライアントをインポート
import { useAuth } from '../../lib/hooks'; // 認証状態管理フックをインポート
import ProtectedRoute from '../../components/ProtectedRoute'; // 認証済みルート保護
import { UserProfile } from '../../types'; // UserProfile 型をインポート
import Link from 'next/link'; // Linkコンポーネントをインポート

const ViewProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (loading || !user) {
        // userがロード中または存在しない場合は何もしない
        return;
      }

      // Supabaseから現在のユーザー情報を取得
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setFetchError(`プロフィールの取得に失敗しました: ${userError.message}`);
        return;
      }

      if (userData?.user?.user_metadata) {
        // user_metadataからプロフィール情報を抽出
        const userProfile = userData.user.user_metadata as UserProfile;
        setProfile(userProfile);
      } else {
        // プロフィール情報がまだuser_metadataにない場合
        setFetchError('プロフィール情報が見つかりません。作成してください。');
      }
    };

    fetchProfile();
  }, [user, loading]); // userまたはloadingの状態が変化したら再実行

  // ローディング中の表示
  if (loading) {
    return <p>Loading authentication state...</p>;
  }

  // 認証されていない場合はProtectedRouteがリダイレクトを処理
  // ここに到達した場合は認証済み

  if (fetchError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <div className="p-8 bg-white rounded shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">エラー</h2>
            <p className="text-gray-700 mb-4">{fetchError}</p>
            {fetchError.includes('見つかりません') && (
              <Link href="/profile/create" className="text-blue-600 hover:underline">
                プロフィールを作成する
              </Link>
            )}
            <Link href="/login" className="block text-blue-600 hover:underline mt-2">
                ログインページに戻る
              </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p>プロフィール情報を読み込み中...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Spark β - プロフィール確認</title>
        <meta name="description" content="プロフィール確認ページ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded shadow-md w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">プロフィール</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">あだ名:</p>
              <p className="text-lg text-gray-900">{profile.nickname}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">パート:</p>
              <p className="text-lg text-gray-900">{profile.part.join(', ') || '未設定'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">地域:</p>
              <p className="text-lg text-gray-900">{profile.region || '未設定'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">経験年数:</p>
              <p className="text-lg text-gray-900">{profile.experienceYears}年</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/profile/create" className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              プロフィールを編集する
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ViewProfilePage;