import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HostBrief from '../components/HostBrief'
import RsvpCard from '../components/RsvpCard'
import RsvpForm from '../components/RsvpForm'
import type { Event, Rsvp } from '../types'

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [isHost, setIsHost] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const fetchData = async () => {
    if (!slug) return
    setLoading(true)
    setError('')
    const [{ data: eventData, error: eventError }, { data: sessionData }] = await Promise.all([
      supabase.from('events').select('*').eq('slug', slug).is('deleted_at', null).single(),
      supabase.auth.getSession()
    ])
    if (eventError || !eventData) { setError('Event not found. The link may have changed.'); setLoading(false); return }
    setEvent(eventData)
    const userId = sessionData.session?.user.id
    setIsHost(userId === eventData.host_id)
    if (userId === eventData.host_id) {
      const { data: rsvpData } = await supabase.from('rsvps').select('*').eq('event_id', eventData.id).is('deleted_at', null).order('created_at', { ascending: true })
      setRsvps(rsvpData ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [slug])

  const handleApprove = async (rsvpId: string) => {
    await supabase.from('rsvps').update({ approved: true }).eq('id', rsvpId)
    setRsvps(prev => prev.map(r => r.id === rsvpId ? { ...r, approved: true } : r))
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error || !event) return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🎈</div>
          <h1 className="font-serif text-2xl text-ink mb-2">Event not found</h1>
          <p className="font-mono text-dim text-sm">{error || 'This event does not exist.'}</p>
        </div>
      </main>
    </div>
  )

  const eventDate = new Date(event.date)

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-ink text-paper py-14 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="font-mono text-xs text-dim-dark uppercase tracking-widest mb-3">{event.theme}</div>
            <h1 className="font-serif text-5xl font-extrabold mb-4 leading-tight">{event.title}</h1>
            <div className="font-mono text-dim-dark text-sm space-y-1">
              <p>{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
              {event.location && <p>{event.location}</p>}
            </div>
            {event.description && <p className="font-mono text-sm text-dim-dark mt-4 leading-relaxed max-w-lg">{event.description}</p>}
            <button onClick={copyLink}
              className="mt-6 bg-acid text-ink font-mono text-sm font-medium px-5 py-2.5 rounded-full min-h-[44px] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-acid">
              {copied ? 'Link copied!' : 'Share invite link'}
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
          {isHost && (
            <>
              <HostBrief rsvps={rsvps} eventDate={event.date} />
              {rsvps.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl text-ink mb-4">Guest list</h2>
                  <div className="space-y-2">
                    {rsvps.filter(r => !r.deleted_at).map(r => (
                      <RsvpCard key={r.id} rsvp={r} onApprove={handleApprove} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {!isHost && (
            <RsvpForm event={event} onSuccess={fetchData} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
