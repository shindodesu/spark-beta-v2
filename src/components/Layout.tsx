// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-blue-200">
            Spark β
          </Link>
          <div>
            <Link href="/profile/view" className="ml-4 hover:text-blue-200">
              プロフィール
            </Link>
            <Link href="/login" className="ml-4 hover:text-blue-200">
              ログイン
            </Link>
            <Link href="/signup" className="ml-4 hover:text-blue-200">
              サインアップ
            </Link>
            {/* 将来的にログアウトボタンなどを追加 */}
          </div>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <div className="container mx-auto text-sm">
          &copy; {new Date().getFullYear()} Spark β. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;