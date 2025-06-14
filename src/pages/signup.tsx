// pages/signup.tsx
import React from 'react'
import Head from 'next/head'
import AuthForm from '../components/AuthForm'

const SignUpPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Spark β - サインアップ</title>
        <meta name="description" content="Spark βでシャッフルバンドを始めよう！" />
        <link rel="icon" href="/spark-beta-logo.png" />
      </Head>

      <div className="flex justify-center items-center py-12">
        <div className="text-center text-white mb-6">
          <h1 className="text-3xl font-bold drop-shadow-md mb-2">はじめまして！</h1>
          <p className="text-white/80 text-sm">Spark β で新しい出会いを。</p>
        </div>
        <AuthForm isSignUp={true} />
      </div>
    </>
  )
}

export default SignUpPage
