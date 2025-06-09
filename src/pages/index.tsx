// src/pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Head>
        <title>Spark β</title>
        <meta name="description" content="アカペラのバンドマッチングプラットフォーム Spark β" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center text-center p-8 bg-white rounded shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Spark β
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          アカペラをやりたい人同士が、日程と場所ベースでマッチングし、シャッフルバンドを組める場を提供します。
        </p>
        <div className="space-x-4">
          <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg font-semibold">
            サインアップ
          </Link>
          <Link href="/login" className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-lg font-semibold">
            ログイン
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;