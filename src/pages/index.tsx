// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'


interface Event {
  id: string
  event_name: string
  description: string | null
  event_date: string
  location: string | null
  status: 'upcoming' | 'active' | 'past' | 'cancelled'
  created_at: string
  applicantsCount: number  // ← 応募人数
  matchedCount: number     // ← マッチ人数
}



interface HomeProps {
  events: Event[]
}

const HomePage: React.FC<HomeProps> = ({ events }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      // ✅ profilesテーブルを想定
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('ユーザーデータ取得エラー:', error)
        return
      }

      // 空欄チェック
      const hasEmpty = Object.values(data).some(
        (value) => value === null || value === ''
      )
      setIsProfileIncomplete(hasEmpty)
    }

    fetchProfile()
  }, [user])

  return (
    <>
      <Head>
        <title>Spark β</title>
        <meta name="description" content="音文化プラットフォーム Spark β" />
        <link rel="icon" href="/spark-beta-logo.png" />
      </Head>

      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden mb-12">
  <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden mb-12">
  <Image
    src="/Spark_group_photo.jpg"
    alt="Spark β グループ写真"
    layout="fill"
    objectFit="cover"
    className="mb-6 rounded-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] blur-sm brightness-[0.7]"
  />
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow mb-4">Spark β</h1>
    <p className="text-white text-lg md:text-2xl font-light drop-shadow">
      音の体験を自由にする場所、<br/>ここから始まる。
    </p>
  </div>
</div>
</div>
<Image
  src="/spark-beta-logo.png"
  alt="Spark β Logo"
  width={240}
  height={240}
  className="mb-6 rounded-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
 />


        <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-md">
          Spark β
        </h1>
        <p className="text-xl text-white/80 mb-4">
          Sparkからその先へ。
        </p>
        <p className="text-base text-white/70 mb-8 max-w-xl">
          音文化を楽しみたい人同士が、<strong>企画</strong>と<strong>場所</strong>ベースでマッチングし、<br />
          シャッフルバンドを結成できるプラットフォーム。
          <Link href="/about" className="text-sm underline text-white/80 hover:text-white transition">
            …もっと読む
          </Link>
        </p>

        {/* ✅ 使い方ページへのリンク */}
        <Link
          href="/howto"
          className="mb-8 inline-block text-pink-300 hover:text-pink-200 font-semibold underline transition"
        >
          使い方を見る →
        </Link>

        {/* ✅ プロフィール未入力の人向けリマインダー */}
        {user && isProfileIncomplete && (
          <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-md shadow">
            🚨 プロフィールが未完成です！
            <Link href="/profile/create" className="underline font-semibold ml-2">
              こちらから入力してください →
            </Link>
          </div>
        )}

        {!user && (
          <div className="flex space-x-4 mb-12">
            <Link
              href="/signup"
              className="px-6 py-3 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:brightness-110 text-white rounded-md text-lg font-semibold shadow transition"
            >
              サインアップ
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-md text-lg font-semibold shadow transition"
            >
              ログイン
            </Link>
          </div>
        )}
<div className="w-full max-w-4xl mx-auto mb-16">
  <h2 className="text-2xl font-bold text-white text-center mb-6">📸 イベントの様子</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {['Spark_group_photo.jpg','Spark_shuffle_band_1.jpg','Spark_shuffle_band_2.jpg'].map((img, i) => (
      <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden shadow">
        <Image
          src={`/${img}`}
          alt={`イベント写真${i + 1}`}
          layout="fill"
          objectFit="cover"
          className="blur-sm" // 👈 ここがぼかし！
        />
      </div>
    ))}
  </div>
</div>


       {/* イベント一覧表示 */}
<div className="w-full max-w-4xl">
  <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-md">
    開催中・開催予定イベント
  </h2>
  {events.length === 0 ? (
    <p className="text-center text-white/70 text-lg">
      現在、開催予定のイベントはありません。
    </p>
  ) : (
    <>
      {/* 開催中・予定 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {events.filter(e => e.status !== 'past').map((event) => (
          <div
            key={event.id}
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2">{event.event_name}</h3>
            <p className="text-sm mb-1">
              <span className="font-medium">開催日:</span>{' '}
              {new Date(event.event_date).toLocaleDateString('ja-JP')}
            </p>
            {event.location && (
              <p className="text-sm mb-1">
                <span className="font-medium">場所:</span> {event.location}
              </p>
            )}
            <p className="text-sm mb-1">
              <span className="font-medium">応募人数:</span> {event.applicantsCount ?? 0} 人
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium">マッチ人数:</span> {event.matchedCount ?? 0} 人
            </p>
            {event.description && (
              <p className="text-sm text-white/80 mt-2 mb-4">{event.description}</p>
            )}
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
              event.status === 'upcoming'
                ? 'bg-blue-300 text-blue-900'
                : 'bg-green-300 text-green-900'
            }`}>
              {event.status === 'upcoming' ? '開催予定' : '開催中'}
            </span>
            <div className="mt-4 text-right">
              <Link href={`/events/${event.id}/apply`} className="text-pink-300 hover:text-pink-200 font-semibold">
                参加したい！ →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 終了イベント */}
      <h2 className="text-2xl font-bold text-white text-center mb-4 drop-shadow-md mt-16">
        終了イベント（実績）
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.filter(e => e.status === 'past').map((event) => (
          <div
            key={event.id}
            className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-white shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-xl font-bold mb-2">{event.event_name}</h3>
            <p className="text-sm mb-1">
              <span className="font-medium">開催日:</span>{' '}
              {new Date(event.event_date).toLocaleDateString('ja-JP')}
            </p>
            {event.location && (
              <p className="text-sm mb-1">
                <span className="font-medium">場所:</span> {event.location}
              </p>
            )}
            <p className="text-sm mb-1">
              <span className="font-medium">応募人数:</span> {event.applicantsCount ?? 0} 人
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium">マッチ人数:</span> {event.matchedCount ?? 0} 人
            </p>
            {event.description && (
              <p className="text-sm text-white/80 mt-2 mb-4">{event.description}</p>
            )}
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-300 text-gray-900">
              終了
            </span>
          </div>
        ))}
      </div>
    </>
  )}
</div>

<div className="h-16" /> {/* ← セクション間に余白追加 */}

{/* 各ページへの導線セクション */}
<div className="w-full max-w-4xl mb-16">
  <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow-md">
    Spark β をもっと知る
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <Link href="/about" className="bg-white/10 backdrop-blur-md p-6 rounded-lg hover:bg-white/20 transition shadow">
      <h3 className="text-xl font-bold text-pink-300 mb-2">Spark β について</h3>
      <p className="text-sm text-white/80">
        サービスの思想や立ち上げの経緯を紹介。なぜSpark βなのか。
      </p>
    </Link>

    <Link href="/howto" className="bg-white/10 backdrop-blur-md p-6 rounded-lg hover:bg-white/20 transition shadow">
      <h3 className="text-xl font-bold text-pink-300 mb-2">使い方ガイド</h3>
      <p className="text-sm text-white/80">
        サインアップからバンド結成・参加までの流れを丁寧に解説。
      </p>
    </Link>

    <Link href="/howto" className="bg-white/10 backdrop-blur-md p-6 rounded-lg hover:bg-white/20 transition shadow">
      <h3 className="text-xl font-bold text-pink-300 mb-2">あなたのバンド</h3>
      <p className="text-sm text-white/80">
        まだバンドがありませんか？イベントの参加表明をして新しい仲間と楽しもう！
      </p>
    </Link>

    <Link href="/interviews" className="bg-white/10 backdrop-blur-md p-6 rounded-lg hover:bg-white/20 transition shadow">
      <h3 className="text-xl font-bold text-pink-300 mb-2">利用者の声</h3>
      <p className="text-sm text-white/80">
        実際に参加した人たちのリアルな声。バンド参加のきっかけとは？
      </p>
    </Link>

    <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg hover:bg-white/20 transition shadow">
  <h3 className="text-xl font-bold text-pink-300 mb-2">ホーム画面に追加</h3>
  <p className="text-sm text-white/80 mb-2">
    スマートフォンからすぐにアクセスできるように、共有ボタンを押してSpark β を今すぐホーム画面に追加しましょう！
  </p>
  <p className="text-xs text-white/50 italic">
    iOSはSafariで、AndroidはChromeで「ホーム画面に追加」からどうぞ。
  </p>
</div>


    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSf8GY_PvIwBfh4W6-Mq-xIBRWDgj4eQ2262Vbk-mjKKlPR29Q/viewform?usp=dialog"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/10 backdrop-blur-md p-6 rounded-lg hover:bg-white/20 transition shadow"
    >
      <h3 className="text-xl font-bold text-pink-300 mb-2">お問い合わせ</h3>
      <p className="text-sm text-white/80">
        バグ報告、フィードバック、コラボの相談などはこちらから。
      </p>
    </a>
  </div>
</div>

      </div>
      
    </>
  )
  
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })

  if (error || !events) {
    console.error('Error fetching events:', error)
    return { props: { events: [] }, revalidate: 60 }
  }

   // 手動で上書きするイベントIDと数を定義
  const manualStats: Record<string, { applicants: number; matched: number }> = {
    'f67b0f74-59b6-4ec0-84d2-3cc7609e3fb9': { applicants: 40, matched: 12 }, // ←ここを実際のevent.idに
  }


   // 応募数・マッチ数の付加
   const enhancedEvents = await Promise.all(
    events.map(async (event) => {
      const manual = manualStats[event.id]

      if (manual) {
        return {
          ...event,
          applicantsCount: manual.applicants,
          matchedCount: manual.matched,
        }
      }

      const { count: applicantsCount } = await supabase
        .from('event_participants')
        .select('user_id', { count: 'exact', head: true })
        .eq('event_id', event.id)

      const { count: matchedCount } = await supabase
        .from('bands')
        .select('id', { count: 'exact', head: true })
        .eq('event_id', event.id)

      return {
        ...event,
        applicantsCount: applicantsCount ?? 0,
        matchedCount: matchedCount ?? 0,
      }
    })
  )

  return {
    props: {
      events: enhancedEvents,
    },
    revalidate: 60, // ISRで1分ごとに再生成
  }
  
}


export default HomePage
