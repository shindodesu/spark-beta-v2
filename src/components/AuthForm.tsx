// src/components/AuthForm.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Supabaseクライアントをインポート
import { useRouter } from 'next/router';

interface AuthFormProps {
  isSignUp: boolean; // trueならサインアップ、falseならログイン
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // サインアップ処理
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setMessage(`サインアップエラー: ${error.message}`);
        } else if (data.user) {
          setMessage('サインアップ成功！確認メールをチェックしてください。');
          // サインアップ成功後、プロフィール作成ページへリダイレクト
          // email confirmationをオフにしている場合はすぐにリダイレクト
          if (data.session) { // セッションが即座に生成される場合（Email Confirmation OFF）
             router.push('/profile/create');
          } else { // 確認メールが必要な場合
             setMessage('サインアップ成功！確認メールをチェックしてください。');
             // ユーザーに確認メールの指示を出す
          }
        } else {
            // data.user が null の場合（通常は確認メールが送信された状態）
            setMessage('サインアップ成功！確認メールをチェックしてください。');
        }
      } else {
        // ログイン処理
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(`ログインエラー: ${error.message}`);
        } else if (data.user) {
          setMessage('ログイン成功！');
          // ログイン成功後、プロフィール作成ページまたはダッシュボードへリダイレクト
          // 既存ユーザーの場合、プロフィール作成済みか確認してリダイレクト先を変えるロジックが必要になるが、
          // MVPではひとまず '/profile/create' へ。
          router.push('/profile/create');
        }
      }
    } catch (error) { // 型注釈を削除するか、明示的に unknown にする
      // エラーが Error オブジェクトであることを確認する
      if (error instanceof Error) {
        setMessage(`予期せぬエラー: ${error.message}`);
      } else {
        // Error オブジェクトでない場合（例えば文字列など）
        setMessage(`予期せぬエラー: ${String(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'サインアップ' : 'ログイン'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '処理中...' : (isSignUp ? 'サインアップ' : 'ログイン')}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('エラー') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        <div className="mt-6 text-center">
          {isSignUp ? (
            <p className="text-sm text-gray-600">
              アカウントをお持ちですか？{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                ログインはこちら
              </a>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              アカウントをお持ちではありませんか？{' '}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                サインアップはこちら
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;