// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import Image from 'next/image'
import { GetStaticProps } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Event {
  id: string
  event_name: string
  description: string | null
  event_date: string
  location: string | null
  status: 'upcoming' | 'active' | 'past' | 'cancelled'
  created_at: string
}

interface HomeProps {
  events: Event[]
}

const HomePage: React.FC<HomeProps> = ({ events }) => {
  return (
    <Layout>
      <Head>
        <title>Spark β</title>
        <meta name="description" content="アカペラのバンドマッチングプラットフォーム Spark β" />
        <link rel="icon" href="/spark-beta-logo.png" />
      </Head>

      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        <Image
          src="/spark-beta-logo.png"
          alt="Spark β Logo"
          width={120}
          height={120}
          className="mb-6 drop-shadow-lg"
        />
        <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-md">
          Spark β
        </h1>
        <p className="text-xl text-white/80 mb-4">
          Sparkからその先へ。
        </p>
        <p className="text-base text-white/70 mb-8 max-w-xl">
          アカペラをやりたい人同士が、<strong>企画</strong>と<strong>場所</strong>ベースでマッチングし、<br />
          シャッフルバンドを結成できるプラットフォーム。
        </p>
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

        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-md">
            開催中・開催予定イベント
          </h2>

          {events.length === 0 ? (
            <p className="text-center text-white/70 text-lg">
              現在、開催予定のイベントはありません。
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
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
                  {event.description && (
                    <p className="text-sm text-white/80 mt-2 mb-4">
                      {event.description}
                    </p>
                  )}
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'upcoming'
                        ? 'bg-blue-300 text-blue-900'
                        : event.status === 'active'
                        ? 'bg-green-300 text-green-900'
                        : event.status === 'cancelled'
                        ? 'bg-red-300 text-red-900'
                        : 'bg-gray-300 text-gray-900'
                    }`}
                  >
                    {event.status === 'upcoming'
                      ? '開催予定'
                      : event.status === 'active'
                      ? '開催中'
                      : event.status === 'cancelled'
                      ? '中止'
                      : '終了'}
                  </span>
                  <div className="mt-4 text-right">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-pink-300 hover:text-pink-200 font-semibold"
                    >
                      詳細を見る →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
    .neq('status', 'past')

  if (error) {
    console.error('Error fetching events:', error)
    return { props: { events: [] }, revalidate: 60 }
  }

  return { props: { events: events || [] }, revalidate: 60 }
}

export default HomePage
