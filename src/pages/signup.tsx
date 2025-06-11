// src/pages/signup.tsx
import React from 'react';
import AuthForm from '../components/AuthForm';
import Head from 'next/head';
import Layout from '../components/Layout'; // Layout コンポーネントをインポート

const SignUpPage: React.FC = () => {
  return (
    <Layout> {/* ここで Layout でラップ */}
      <Head>
        <title>Spark β - サインアップ</title>
        <meta name="description" content="Spark βでシャッフルバンドを始めよう！" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthForm isSignUp={true} />
    </Layout>
  );
};

export default SignUpPage;