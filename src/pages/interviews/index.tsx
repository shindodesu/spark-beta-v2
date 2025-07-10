// pages/interviews/index.tsx
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'

export default function InterviewIndex() {
  return (
    <>
      <Head>
        <title>利用者の声 | Spark β</title>
        <meta name="description" content="Spark β シャッフルバンド参加者のインタビュー" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center drop-shadow">
          🎤 利用者の声
        </h1>
        <p className="text-center text-white/70 mb-10">
          Spark β のシャッフルバンド企画に参加した方々のリアルな声を紹介します。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 純菜さんインタビュー */}
          <Link href="/interviews/junna" className="group bg-white/10 backdrop-blur-md p-6 rounded-lg hover:bg-white/20 transition shadow">
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src="/junna_icon.jpg"
                alt="純菜アイコン"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="text-lg font-semibold">純菜（山口大学,Sing A Song）</p>
                <p className="text-sm text-white/70">初めて他大の人と関われたきっかけ</p>
              </div>
            </div>
            <p className="text-sm text-white/80">
              小さなサークルでも、個人で参加できる場があったことが挑戦のきっかけに。
            </p>
            <p className="mt-3 text-pink-300 text-sm font-semibold group-hover:underline">
              → インタビューを読む
            </p>
          </Link>

          {/* 今後のインタビュー用のカードを追加する場所 */}
          {/* 
          <Link href="/interviews/xxxxx" className="...">...</Link>
          */}
        </div>
      </div>
    </>
  )
}
