import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-ink text-paper">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-bold tracking-tight text-paper">
          Getfetti
        </Link>
        <div className="hidden sm:flex items-center gap-4 font-mono text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="text-dim-dark hover:text-paper transition-colors">My Events</Link>
              <Link to="/create" className="bg-primary text-white px-4 py-2 rounded-full min-h-[44px] flex items-center hover:opacity-90 transition-opacity">New Event</Link>
              <button onClick={handleLogout} className="text-dim-dark hover:text-paper transition-colors min-h-[44px]">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-dim-dark hover:text-paper transition-colors">Log in</Link>
              <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-full min-h-[44px] flex items-center hover:opacity-90 transition-opacity">Get started</Link>
            </>
          )}
        </div>
        <button
          className="sm:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-paper"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>
      {menuOpen && (
        <div className="sm:hidden bg-ink border-t border-white/10 px-4 pb-4 flex flex-col gap-2 font-mono text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="py-3 text-dim-dark" onClick={() => setMenuOpen(false)}>My Events</Link>
              <Link to="/create" className="py-3 text-paper" onClick={() => setMenuOpen(false)}>New Event</Link>
              <button onClick={handleLogout} className="py-3 text-left text-dim-dark">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-3 text-dim-dark" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/signup" className="py-3 text-paper font-medium" onClick={() => setMenuOpen(false)}>Get started free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
