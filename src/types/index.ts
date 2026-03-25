export interface UserProfile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  deleted_at: string | null
}

export type EventPrivacy = 'public' | 'link_only' | 'invite_only'
export type PlusOneRule = 'none' | 'approved_only' | 'all'
export type EventTheme = 'default' | 'dinner' | 'birthday' | 'rooftop' | 'housewarming'
export type ViewMode = 'vibe' | 'simple'

export interface Event {
  id: string
  host_id: string
  title: string
  date: string
  location: string
  description: string | null
  cover_image_url: string | null
  privacy: EventPrivacy
  plus_one_rule: PlusOneRule
  theme: EventTheme
  slug: string
  created_at: string
  deleted_at: string | null
}

export type RsvpStatus = 'yes' | 'no' | 'maybe'
export type MaybeReason = 'schedule_conflict' | 'waiting_plus_one' | 'arriving_late' | 'need_more_info'

export interface Rsvp {
  id: string
  event_id: string
  user_id: string | null
  guest_name: string
  guest_email: string
  status: RsvpStatus
  maybe_reason: MaybeReason | null
  plus_one_count: number
  answers: Record<string, string> | null
  approved: boolean
  created_at: string
  deleted_at: string | null
}

export interface HostBriefItem {
  type: 'action' | 'info'
  label: string
  value: string | number
  urgent: boolean
}

export interface EventWithStats extends Event {
  yes_count: number
  no_count: number
  maybe_count: number
  pending_approvals: number
  likely_attendance: number
}
