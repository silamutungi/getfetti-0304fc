import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import type { Event } from '../types'

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEvents = async () => {
    setError('')
    setLoading(true)
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) { setError('Session expired. Please sign in again.'); setLoading(false); return }
    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('host_id', sessionData.session.user.id)
      .is('deleted_at', null)
      .order('date', { ascending: true })
    setLoading(false)
    if (fetchError) { setError('Could not load your events. Please try again.'); return }
    setEvents(data ?? [])
  }

  useEffect(() => { fetchEvents() }, [])

  const upcoming = events.filter(e => new Date(e.date) >= new Date())
  const past = events.filter(e => new Date(e.date) < new Date())

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl font-bold text-ink">My Events</h1>
          <Link
            to="/create"
            className="bg-primary text-white font-mono font-medium px-6 py-3 rounded-full min-h-[44px] flex items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
          >
            + New Event
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 font-mono text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchEvents} className="underline ml-4 hover:no-underline">Retry</button>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-serif text-2xl text-ink mb-2">No events yet</h2>
            <p className="font-mono text-dim text-sm mb-6">Create your first event and share it with a single link.</p>
            <Link
              to="/create"
              className="bg-primary text-white font-mono px-8 py-3 rounded-full min-h-[44px] inline-flex items-center hover:opacity-90 transition-opacity"
            >
              Create your first event
            </Link>
          </div>
        )}

        {!loading && upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="font-mono text-xs text-dim uppercase tracking-widest mb-4">Upcoming</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {upcoming.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        )}

        {!loading && past.length > 0 && (
          <section>
            <h2 className="font-mono text-xs text-dim uppercase tracking-widest mb-4">Past</h2>
            <div className="grid sm:grid-cols-2 gap-4 opacity-60">
              {past.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const date = new Date(event.date)
  const isPast = date < new Date()
  return (
    <Link
      to={`/e/${event.slug}`}
      className="block bg-white border border-ink/10 rounded-2xl p-5 hover:border-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-xs text-dim uppercase tracking-widest">{event.theme}</span>
        {!isPast && <span className="bg-acid text-ink font-mono text-xs px-2 py-1 rounded-full">Live</span>}
      </div>
      <h3 className="font-serif text-xl font-semibold text-ink mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
      <p className="font-mono text-sm text-dim">
        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        {event.location ? ` · ${event.location}` : ''}
      </p>
    </Link>
  )
}
