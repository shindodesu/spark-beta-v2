// src/pages/login.tsx
import React from 'react';
import AuthForm from '../components/AuthForm';
import Head from 'next/head';

const LoginPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Spark β - ログイン</title>
        <meta name="description" content="Spark βにログインしてシャッフルバンドを始めよう！" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthForm isSignUp={false} />
    </>
  );
};

export default LoginPage;