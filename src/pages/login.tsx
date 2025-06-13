// pages/login.tsx
import React from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import AuthForm from '../components/AuthForm'

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Spark β - ログイン</title>
        <meta name="description" content="Spark βにログインしてシャッフルバンドを始めよう！" />
        <link rel="icon" href="/spark-beta-logo.png" />
      </Head>

      <div className="flex justify-center items-center py-12">
        <div className="text-center text-white mb-6">
          <h1 className="text-3xl font-bold drop-shadow-md mb-2">おかえりなさい！</h1>
          <p className="text-white/80 text-sm">もう一度Sparkしよう。</p>
        </div>
        <AuthForm isSignUp={false} />
      </div>
    </Layout>
  )
}

export default LoginPage
