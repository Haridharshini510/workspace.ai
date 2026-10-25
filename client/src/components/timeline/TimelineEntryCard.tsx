import { X, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { priorityColor, statusLabel } from '@/lib/utils'
import type { TimelineEntry } from '@/types/timeline'

interface TimelineEntryCardProps {
  entry: TimelineEntry
  onDismiss?: (id: string, source: 'commitment' | 'workspace_item') => void
  showDate?: boolean
}

function formatTime(dateString: string | undefined) {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatDateOnly(dateString: string | undefined) {
  if (!dateString) return null
  const date = new Date(dateString)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()
  return { month, day }
}

function formatDayOfWeek(dateString: string | undefined) {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export function TimelineEntryCard({ entry, onDismiss, showDate = false }: TimelineEntryCardProps) {
  const time = formatTime(entry.deadline)
  const dateInfo = formatDateOnly(entry.deadline)
  const dayOfWeek = formatDayOfWeek(entry.deadline)
  const hasDate = !!entry.deadline

  return (
    <div className="flex gap-4 sm:gap-6">
      {/* Left: Date Column - only shown when showDate is true and there's a date */}
      {showDate && dateInfo ? (
        <div className="flex flex-col items-end min-w-[80px] pt-2">
          <div className="text-right">
            <div className="font-satoshi text-lg font-semibold text-neutral-950 dark:text-neutral-50">
              {dateInfo.month} {dateInfo.day}
            </div>
            <div className="font-satoshi text-xs text-neutral-500 dark:text-neutral-400">
              {dayOfWeek}
            </div>
          </div>
        </div>
      ) : hasDate ? (
        <div className="min-w-[80px]" />
      ) : null}

      {/* Timeline Dot and Line - only show when there's a date */}
      {hasDate && (
        <div className="relative flex flex-col items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 mt-3 z-10" />
          <div className="flex-1 w-px bg-neutral-200 dark:bg-neutral-800 -mt-1" />
        </div>
      )}

      {/* Right: Event Card */}
      <div className="flex-1 pb-6">
        <div className="group relative rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
          {/* Time */}
          {time && (
            <div className="font-satoshi text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              {time}
            </div>
          )}

          {/* Title and Dismiss Button */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-satoshi text-base font-semibold text-neutral-950 dark:text-neutral-50 leading-snug">
              {entry.title}
            </h3>
            {onDismiss && (
              <button
                onClick={() => onDismiss(entry._id, entry.source)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 rounded-lg p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Hide from timeline"
              >
                <X className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              </button>
            )}
          </div>

          {/* Description */}
          <p className="font-newsreader text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
            {entry.description}
          </p>

          {/* Source indicator with icon */}
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-satoshi text-xs">
              {entry.source === 'commitment' ? 'Commitment' : 'Workspace Item'}
            </span>
          </div>

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2">
            <Badge className={priorityColor(entry.priority)}>
              {entry.priority}
            </Badge>
            <Badge className="bg-neutral-950/5 text-neutral-600 dark:bg-neutral-50/10 dark:text-neutral-400">
              {statusLabel(entry.status)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
