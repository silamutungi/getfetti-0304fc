import type { Rsvp } from '../types'

interface Props {
  rsvps: Rsvp[]
  eventDate: string
}

export default function HostBrief({ rsvps, eventDate }: Props) {
  const active = rsvps.filter(r => !r.deleted_at)
  const yes = active.filter(r => r.status === 'yes' && r.approved)
  const maybes = active.filter(r => r.status === 'maybe')
  const pending = active.filter(r => !r.approved && r.status === 'yes')
  const likelyAttendance = yes.length + Math.round(maybes.length * 0.5)
  const daysOut = Math.ceil((new Date(eventDate).getTime() - Date.now()) / 86400000)

  const actions: { label: string; value: string; urgent: boolean }[] = []
  if (pending.length > 0) actions.push({ label: 'Guests awaiting approval', value: `${pending.length} to review`, urgent: true })
  if (maybes.length > 0) actions.push({ label: 'Unresolved maybes', value: `${maybes.length} guests`, urgent: daysOut <= 7 })
  if (daysOut <= 3 && daysOut > 0) actions.push({ label: 'Event coming up', value: `${daysOut} day${daysOut === 1 ? '' : 's'} away`, urgent: true })

  return (
    <div className="bg-ink text-paper rounded-2xl p-6 font-mono">
      <h2 className="font-serif text-xl mb-4">Host Brief</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-acid">{likelyAttendance}</div>
          <div className="text-xs text-dim-dark mt-1">Likely coming</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{yes.length}</div>
          <div className="text-xs text-dim-dark mt-1">Confirmed yes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">{maybes.length}</div>
          <div className="text-xs text-dim-dark mt-1">Maybes</div>
        </div>
      </div>
      {actions.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-dim-dark uppercase tracking-widest mb-3">Handle now</div>
          {actions.map((a, i) => (
            <div key={i} className={`flex justify-between items-center rounded-lg px-4 py-3 ${a.urgent ? 'bg-primary/20 border border-primary/40' : 'bg-white/5'}`}>
              <span className="text-sm">{a.label}</span>
              <span className={`text-sm font-medium ${a.urgent ? 'text-primary' : 'text-dim-dark'}`}>{a.value}</span>
            </div>
          ))}
        </div>
      )}
      {actions.length === 0 && (
        <div className="text-center text-dim-dark text-sm py-4">All clear. Enjoy the calm before the party.</div>
      )}
    </div>
  )
}
