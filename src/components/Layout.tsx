// components/Layout.tsx
import React, { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false)
        setUnreadCount(count || 0)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1e3c72] to-[#2a5298] text-white font-sans">
      {/* ヘッダー */}
      <header className="backdrop-blur-md bg-white/10 sticky top-0 z-50 shadow-md">
        <nav className="max-w-6xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/spark-beta-logo.png"
              alt="Spark β ロゴ"
              width={36}
              height={36}
              className="rounded-full shadow"
            />
            <span className="text-xl font-extrabold tracking-wide drop-shadow-sm hover:text-pink-300 transition">
              Spark β
            </span>
          </Link>

          {/* ハンバーガーアイコン */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col space-y-1 sm:hidden"
          >
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>

          {/* デスクトップメニュー */}
          <div className="hidden sm:flex items-center space-x-4 text-sm font-medium relative">
            <Link href="/profile/view" className="hover:text-pink-300 transition">
              プロフィール
            </Link>
            <Link href="/matching" className="hover:text-pink-300 transition">
              マッチング
            </Link>
            {!user && (
              <>
                <Link href="/login" className="hover:text-pink-300 transition">
                  ログイン
                </Link>
                <Link href="/signup" className="hover:text-pink-300 transition">
                  サインアップ
                </Link>
              </>
            )}
            <Link href="/notifications" className="relative hover:text-pink-300 transition">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* モバイルドロワーメニュー */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur" onClick={() => setMenuOpen(false)}>
          <div
            className="fixed top-0 right-0 w-64 h-full bg-[#1e3c72] p-6 shadow-lg flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white text-right mb-4"
            >
              ✕ 閉じる
            </button>
            <Link href="/profile/view" className="hover:text-pink-300 transition">
              プロフィール
            </Link>
            <Link href="/matching" className="hover:text-pink-300 transition">
              マッチング
            </Link>
            {!user && (
              <>
                <Link href="/login" className="hover:text-pink-300 transition">
                  ログイン
                </Link>
                <Link href="/signup" className="hover:text-pink-300 transition">
                  サインアップ
                </Link>
              </>
            )}
            <Link href="/notifications" className="relative hover:text-pink-300 transition">
              🔔 通知
              {unreadCount > 0 && (
                <span className="ml-2 inline-block text-xs bg-pink-500 text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}

      {/* メイン */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-white/10 backdrop-blur-md text-white text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} Spark β
      </footer>
    </div>
  )
}

export default Layout

