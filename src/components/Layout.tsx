// components/Layout.tsx
import React, { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1e3c72] to-[#2a5298] text-white font-sans">
      {/* ヘッダー */}
      <header className="backdrop-blur-md bg-white/10 sticky top-0 z-50 shadow-md">
        <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/spark-beta-logo.png"
              alt="Spark β ロゴ"
              width={40}
              height={40}
              className="rounded-full shadow"
            />
            <span className="text-2xl font-extrabold tracking-wide drop-shadow-sm hover:text-pink-300 transition">
              Spark β
            </span>
          </Link>
          <div className="space-x-6 text-sm font-medium">
            <Link href="/profile/view" className="hover:text-pink-300 transition">
              プロフィール
            </Link>
            <Link href="/login" className="hover:text-pink-300 transition">
              ログイン
            </Link>
            <Link href="/signup" className="hover:text-pink-300 transition">
              サインアップ
            </Link>
          </div>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-white/10 backdrop-blur-md text-white text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} Spark β — All rights reserved.
      </footer>
    </div>
  )
}

export default Layout
