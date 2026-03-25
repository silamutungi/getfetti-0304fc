import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Event, RsvpStatus, MaybeReason } from '../types'

const maybeReasons: { value: MaybeReason; label: string; description: string }[] = [
  { value: 'schedule_conflict', label: 'Schedule conflict', description: 'I have something else that day' },
  { value: 'waiting_plus_one', label: 'Waiting on a plus-one', description: 'Depends on someone coming with me' },
  { value: 'arriving_late', label: 'Arriving late', description: "I'll be there, just not on time" },
  { value: 'need_more_info', label: 'Need more info', description: 'A question before I commit' }
]

interface Props {
  event: Event
  onSuccess: () => void
}

export default function RsvpForm({ event, onSuccess }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<RsvpStatus | ''>('')
  const [maybeReason, setMaybeReason] = useState<MaybeReason | ''>('')
  const [plusOne, setPlusOne] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Please enter your name.'); return }
    if (!email.trim()) { setError('Please enter your email.'); return }
    if (!status) { setError('Please choose your RSVP.'); return }
    if (status === 'maybe' && !maybeReason) { setError('Please tell the host why you might not make it.'); return }
    setLoading(true)
    const { error: insertError } = await supabase.from('rsvps').insert({
      event_id: event.id,
      guest_name: name.trim(),
      guest_email: email.trim(),
      status,
      maybe_reason: maybeReason || null,
      plus_one_count: event.plus_one_rule === 'none' ? 0 : plusOne,
      approved: event.plus_one_rule !== 'approved_only',
      user_id: null
    })
    setLoading(false)
    if (insertError) { setError('Could not save your RSVP. Please try again.'); return }
    setSubmitted(true)
    onSuccess()
  }

  if (submitted) return (
    <div className="bg-ink text-paper rounded-2xl p-8 text-center font-mono">
      <div className="text-4xl mb-3">🎉</div>
      <h2 className="font-serif text-2xl mb-2">You're in!</h2>
      <p className="text-dim-dark text-sm">The host has your RSVP. See you there.</p>
    </div>
  )

  return (
    <section>
      <h2 className="font-serif text-2xl text-ink mb-6">RSVP</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rsvp-name" className="block font-mono text-sm text-ink mb-1">Your name</label>
            <input id="rsvp-name" type="text" required maxLength={80} value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              placeholder="Alex" />
          </div>
          <div>
            <label htmlFor="rsvp-email" className="block font-mono text-sm text-ink mb-1">Email</label>
            <input id="rsvp-email" type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              placeholder="you@example.com" />
          </div>
        </div>
        <div>
          <label className="block font-mono text-sm text-ink mb-2">Are you coming?</label>
          <div className="flex gap-3">
            {([['yes', 'Going'], ['maybe', 'Maybe'], ['no', 'Not going']] as [RsvpStatus, string][]).map(([val, label]) => (
              <button key={val} type="button" onClick={() => setStatus(val)}
                className={`flex-1 rounded-xl py-3 font-mono text-sm min-h-[44px] border-2 transition-colors ${status === val ? 'border-primary bg-primary/5 text-primary-dark font-medium' : 'border-ink/10 bg-white text-dim hover:border-primary/30'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {status === 'maybe' && (
          <div>
            <label className="block font-mono text-sm text-ink mb-2">What's holding you back?</label>
            <div className="space-y-2">
              {maybeReasons.map(r => (
                <button key={r.value} type="button" onClick={() => setMaybeReason(r.value)}
                  className={`w-full text-left rounded-xl px-4 py-3 font-mono text-sm min-h-[44px] border-2 transition-colors ${maybeReason === r.value ? 'border-primary bg-primary/5' : 'border-ink/10 bg-white hover:border-primary/30'}`}>
                  <span className="text-ink font-medium">{r.label}</span>
                  <span className="text-dim ml-2">{r.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {event.plus_one_rule !== 'none' && status === 'yes' && (
          <div>
            <label htmlFor="plus-one-count" className="block font-mono text-sm text-ink mb-1">Bringing anyone?</label>
            <select id="plus-one-count" value={plusOne} onChange={e => setPlusOne(Number(e.target.value))}
              className="w-full border border-ink/20 rounded-xl px-4 py-3 font-mono text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]">
              <option value={0}>Just me</option>
              <option value={1}>+1</option>
              <option value={2}>+2</option>
              <option value={3}>+3</option>
            </select>
          </div>
        )}
        {error && <p className="font-mono text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white font-mono font-medium rounded-full px-6 py-4 min-h-[52px] hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          {loading ? 'Sending RSVP...' : 'Send RSVP'}
        </button>
      </form>
    </section>
  )
}
