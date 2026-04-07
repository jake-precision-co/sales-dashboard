'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.push('/')
    } else {
      setError('Invalid credentials')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#111] border border-[#222] rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">THE FILM ROOM</h1>
          <p className="text-gray-300 mt-2 text-sm tracking-[0.2em] uppercase">
            Precision Sales · Built to Win
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2 uppercase tracking-widest">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition"
              placeholder="jake / joe / jc"
              autoComplete="off"
              autoCapitalize="none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/5 border border-red-400/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Entering...' : 'Enter Film Room →'}
          </button>
        </form>
      </div>
    </div>
  )
}
