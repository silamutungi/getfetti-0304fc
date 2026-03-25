import type { Rsvp, MaybeReason } from '../types'

const maybeLabels: Record<MaybeReason, string> = {
  schedule_conflict: 'Schedule conflict',
  waiting_plus_one: 'Waiting on a plus-one',
  arriving_late: 'Arriving late',
  need_more_info: 'Needs more info'
}

interface Props {
  rsvp: Rsvp
  onApprove?: (id: string) => void
}

export default function RsvpCard({ rsvp, onApprove }: Props) {
  const statusColors = { yes: 'text-green-400', no: 'text-red-400', maybe: 'text-yellow-400' }
  const statusLabels = { yes: 'Going', no: 'Not going', maybe: 'Maybe' }

  return (
    <div className="bg-white border border-paper rounded-xl px-4 py-3 font-mono text-sm flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-ink truncate">{rsvp.guest_name}</div>
        {rsvp.status === 'maybe' && rsvp.maybe_reason && (
          <div className="text-xs text-dim mt-0.5">{maybeLabels[rsvp.maybe_reason]}</div>
        )}
        {rsvp.plus_one_count > 0 && (
          <div className="text-xs text-dim mt-0.5">+{rsvp.plus_one_count} guest{rsvp.plus_one_count > 1 ? 's' : ''}</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${statusColors[rsvp.status]}`}>{statusLabels[rsvp.status]}</span>
        {!rsvp.approved && rsvp.status === 'yes' && onApprove && (
          <button
            onClick={() => onApprove(rsvp.id)}
            className="bg-primary text-white text-xs px-3 py-1.5 rounded-full min-h-[44px] flex items-center hover:opacity-90 transition-opacity"
          >
            Approve
          </button>
        )}
      </div>
    </div>
  )
}
