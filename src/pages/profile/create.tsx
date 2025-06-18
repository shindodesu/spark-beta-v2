import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/hooks'
import ProtectedRoute from '../../components/ProtectedRoute'
import ProfileForm from '../../components/ProfileForm'
import { User } from '../../types'

const CreateProfilePage: React.FC = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialProfileData, setInitialProfileData] = useState<Omit<User, 'id' | 'email'> | undefined>(undefined)

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!user) return

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('name, real_name, part, experience_years, region, bio, university')
        .eq('id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        setError(`プロフィールの取得に失敗しました: ${fetchError.message}`)
      } else if (data) {
        setInitialProfileData({
          name: data.name,
          real_name: data.real_name,
          part: data.part,
          experience_years: data.experience_years,
          region: data.region,
          bio: data.bio,
          university: data.university,
        })
      }
    }

    if (!loading && user) {
      fetchExistingProfile()
    }
  }, [user, loading])

  const handleProfileSubmit = async (profileData: Omit<User, 'id' | 'email'>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      if (!user) {
        setError('ユーザーが認証されていません。再度ログインしてください。')
        router.push('/login')
        return
      }

      const { error: upsertError } = await supabase.from('users').upsert(
        {
          id: user.id,
          name: profileData.name,
          real_name: profileData.real_name,
          part: profileData.part,
          region: profileData.region,
          experience_years: profileData.experience_years,
          bio: profileData.bio,
          university: profileData.university,
          email: user.email,
        },
        { onConflict: 'id' }
      )

      if (upsertError) {
        setError(`プロフィールの保存に失敗しました: ${upsertError.message}`)
      } else {
        alert('プロフィールが正常に保存されました！')
        router.push('/profile/view')
      }
    } catch (err: unknown) {
      setError(`予期せぬエラーが発生しました: ${String(err)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <p>認証状態を確認中...</p>

  return (
    <ProtectedRoute>
      <Head>
        <title>Spark β - プロフィール作成</title>
        <meta name="description" content="プロフィール入力ページ" />
        <link rel="icon" href="/spark-beta-logo.png" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] to-[#2a5298] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-6 text-center drop-shadow-sm">プロフィールを入力</h2>
          <ProfileForm
            initialData={
              initialProfileData ?? {
                name: '',
                real_name: '',
                university: '',
                part: [],
                region: '',
                experience_years: 0,
                bio: '',
              }
            }
            onSubmit={handleProfileSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default CreateProfilePage
