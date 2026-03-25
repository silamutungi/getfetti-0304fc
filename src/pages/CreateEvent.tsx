import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import type { EventPrivacy, PlusOneRule, EventTheme } from '../types'

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).slice(2, 7)
}

export default function CreateEvent() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState<EventPrivacy>('link_only')
  const [plusOne, setPlusOne] = useState<PlusOneRule>('all')
  const [theme, setTheme] = useState<EventTheme>('default')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const themeHints: Record<EventTheme, string> = {
    default: 'General event',
    birthday: 'Birthday celebration — fun defaults',
    dinner: 'Dinner — dietary prompts added',
    rooftop: 'Rooftop — weather backup prompt added',
    housewarming: 'Housewarming — registry link prompt added'
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Event title is required.'); return }
    if (!date) { setError('Please pick a date and time.'); return }
    if (title.length > 120) { setError('Title must be under 120 characters.'); return }
    setLoading(true)
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) { setError('Session expired. Please sign in again.'); setLoading(false); return }
    const slug = generateSlug(title)
    const { data, error: insertError } = await supabase.from('events').insert({
      host_id: sessionData.session.user.id,
      title: title.trim(),
      date,
      location: location.trim(),
      description: description.trim() || null,
      privacy,
      plus_one_rule: plusOne,
      theme,
      slug
    }).select().single()
    setLoading(false)
    if (insertError) { setError('Could not create your event. Please try again.'); return }
    navigate(`/e/${data.slug}`)
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <h1 className="font-serif text-4xl font-bold text-ink mb-2">New Event</h1>
        <p className="font-mono text-dim text-sm mb-8">Fill in the details. You can always edit after publishing.</p>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="title" className="block font-mono text-sm text-ink mb-1">Event name *</label>
            <input id="title" type="text" required maxLength={120} value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              placeholder="Sarah's 30th" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block font-mono text-sm text-ink mb-1">Date and time *</label>
              <input id="date" type="datetime-local" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" />
            </div>
            <div>
              <label htmlFor="location" className="block font-mono text-sm text-ink mb-1">Location</label>
              <input id="location" type="text" maxLength={200} value={location} onChange={e => setLocation(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="123 Main St or Zoom" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block font-mono text-sm text-ink mb-1">Description</label>
            <textarea id="description" rows={3} maxLength={1000} value={description} onChange={e => setDescription(e.target.value)}
              className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="What should guests know before they arrive?" />
          </div>
          <div>
            <label className="block font-mono text-sm text-ink mb-2">Theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(themeHints) as EventTheme[]).map(t => (
                <button key={t} type="button"
                  onClick={() => setTheme(t)}
                  className={`rounded-xl px-3 py-2 font-mono text-xs min-h-[44px] border-2 transition-colors ${theme === t ? 'border-primary bg-primary/5 text-primary-dark' : 'border-ink/10 bg-white text-dim hover:border-primary/30'}`}>
                  {themeHints[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="privacy" className="block font-mono text-sm text-ink mb-1">Who can see this?</label>
              <select id="privacy" value={privacy} onChange={e => setPrivacy(e.target.value as EventPrivacy)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]">
                <option value="link_only">Anyone with the link</option>
                <option value="public">Public (discoverable)</option>
                <option value="invite_only">Invite only</option>
              </select>
            </div>
            <div>
              <label htmlFor="plus-one" className="block font-mono text-sm text-ink mb-1">Plus-ones</label>
              <select id="plus-one" value={plusOne} onChange={e => setPlusOne(e.target.value as PlusOneRule)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]">
                <option value="all">Anyone can bring one</option>
                <option value="approved_only">Needs my approval</option>
                <option value="none">No plus-ones</option>
              </select>
            </div>
          </div>
          {error && <p className="font-mono text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white font-mono font-medium rounded-full px-6 py-4 min-h-[52px] hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            {loading ? 'Creating...' : 'Create event'}
          </button>
        </form>
      </main>
    </div>
  )
}
