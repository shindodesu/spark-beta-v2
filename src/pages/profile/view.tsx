// pages/profile/view.tsx
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/hooks'
import ProtectedRoute from '../../components/ProtectedRoute'
import { User } from '../../types'
import Link from 'next/link'

const ViewProfilePage: React.FC = () => {
  const { user, loading } = useAuth()
  const [profileData, setProfileData] = useState<User | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (loading || !user) return

      const { data, error } = await supabase
        .from('users')
        .select('id, name, real_name, email, part, experience_years, region, bio')
        .eq('id', user.id)
        .single()

      if (error) {
        setFetchError(
          error.code === 'PGRST116'
            ? 'プロフィール情報が見つかりません。作成してください。'
            : `プロフィールの取得に失敗しました: ${error.message}`
        )
        return
      }

      if (data) {
        setProfileData({
          id: data.id,
          nickname: data.name,
          real_name: data.real_name,
          email: data.email,
          part: data.part,
          experience_years: data.experience_years,
          region: data.region,
          bio: data.bio,
        })
      }
    }

    fetchProfile()
  }, [user, loading])

  if (loading) return <p>認証状態を確認中...</p>

  if (fetchError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2a5298] text-white px-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">エラー</h2>
            <p className="mb-4">{fetchError}</p>
            <Link href="/profile/create" className="text-pink-300 hover:underline">
              プロフィールを作成する
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!profileData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center text-white">
          <p>プロフィール情報を読み込み中...</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Spark β - プロフィール確認</title>
        <meta name="description" content="プロフィール確認ページ" />
        <link rel="icon" href="/spark-beta-logo.png" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] to-[#2a5298] flex items-center justify-center px-4 py-10">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl text-white w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center drop-shadow-sm">あなたのプロフィール</h2>
          <div className="space-y-4 text-white/90">
            <p><strong>あだ名：</strong>{profileData.nickname}</p>
            <p><strong>本名：</strong>{profileData.real_name}</p>
            <p><strong>パート：</strong>{profileData.part?.join(', ')}</p>
            <p><strong>地域：</strong>{profileData.region}</p>
            <p><strong>経験年数：</strong>{profileData.experience_years}年</p>
            <p><strong>自己紹介：</strong>{profileData.bio}</p>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/profile/create"
              className="inline-block bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 hover:brightness-110 text-white py-2 px-4 rounded shadow transition"
            >
              編集する
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ViewProfilePage
