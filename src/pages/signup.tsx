// src/pages/signup.tsx
import React from 'react';
import AuthForm from '../components/AuthForm';
import Head from 'next/head';

const SignUpPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Spark β - サインアップ</title>
        <meta name="description" content="Spark βでシャッフルバンドを始めよう！" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthForm isSignUp={true} />
    </>
  );
};

export default SignUpPage;