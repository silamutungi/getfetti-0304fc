import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (authError) { setError('Those credentials did not work. Double-check and try again.'); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-4xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="font-mono text-dim text-sm mb-8">Sign in to see your events and host brief.</p>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block font-mono text-sm text-ink mb-1">Email</label>
              <input
                id="email" type="email" autoComplete="email" required maxLength={254}
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-mono text-sm text-ink mb-1">Password</label>
              <input
                id="password" type="password" autoComplete="current-password" required maxLength={128}
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="font-mono text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-white font-mono font-medium rounded-full px-6 py-3 min-h-[52px] hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="font-mono text-sm text-dim mt-6 text-center">
            No account yet?{' '}
            <Link to="/signup" className="text-primary-dark underline hover:no-underline">Create one free</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
