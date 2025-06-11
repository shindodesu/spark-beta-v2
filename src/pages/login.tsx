// src/pages/login.tsx
import React from 'react';
import AuthForm from '../components/AuthForm';
import Head from 'next/head';
import Layout from '../components/Layout'; // Layout コンポーネントをインポート

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Spark β - ログイン</title>
        <meta name="description" content="Spark βにログインしてシャッフルバンドを始めよう！" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthForm isSignUp={false} />
    </Layout>
  );
};

export default LoginPage;