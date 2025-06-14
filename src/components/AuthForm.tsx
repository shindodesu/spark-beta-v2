// components/AuthForm.tsx
import Link from 'next/link'
import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

interface AuthFormProps {
  isSignUp: boolean
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignUp }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) {
          setMessage(`サインアップエラー: ${error.message}`)
        } else if (data.user) {
          if (data.session) {
            router.push('/profile/create')
          } else {
            setMessage('サインアップ成功！確認メールをチェックしてください。')
          }
        } else {
          setMessage('サインアップ成功！確認メールをチェックしてください。')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
          setMessage(`ログインエラー: ${error.message}`)
        } else if (data.user) {
          setMessage('ログイン成功！')
          router.push('/')
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`予期せぬエラー: ${error.message}`)
      } else {
        setMessage(`予期せぬエラー: ${String(error)}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] to-[#2a5298] flex items-center justify-center px-4 py-12">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md p-8 text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6 drop-shadow-md">
          {isSignUp ? '新規登録' : 'ログイン'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-3 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:brightness-110 text-white font-semibold transition"
            disabled={loading}
          >
            {loading ? '処理中...' : isSignUp ? '登録する' : 'ログイン'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes('エラー') ? 'text-red-300' : 'text-green-300'
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-white/80">
          {isSignUp ? (
            <p>
              アカウントをお持ちですか？{' '}
              <Link href="/login" className="text-pink-300 hover:text-pink-200 font-medium underline">
                ログインはこちら
              </Link>
            </p>
          ) : (
            <p>
              アカウントをお持ちではありませんか？{' '}
              <Link href="/signup" className="text-pink-300 hover:text-pink-200 font-medium underline">
                サインアップはこちら
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthForm
