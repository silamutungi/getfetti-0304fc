import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Please enter your name.'); return }
    if (!email || !password) { setError('Email and password are required.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: name.trim() } }
    })
    setLoading(false)
    if (authError) { setError('Could not create your account. ' + authError.message); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-4xl font-bold text-ink mb-2">Start hosting</h1>
          <p className="font-mono text-dim text-sm mb-8">Create your free Getfetti account.</p>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block font-mono text-sm text-ink mb-1">Your name</label>
              <input
                id="name" type="text" autoComplete="name" required maxLength={80}
                value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="Alex Chen"
              />
            </div>
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
                id="password" type="password" autoComplete="new-password" required maxLength={128}
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="At least 8 characters"
              />
            </div>
            {error && <p className="font-mono text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-white font-mono font-medium rounded-full px-6 py-3 min-h-[52px] hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="font-mono text-sm text-dim mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-dark underline hover:no-underline">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
