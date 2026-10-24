import { NavLink } from 'react-router-dom'
import { Info, CheckSquare, Compass, Clock } from 'lucide-react'
import { routes } from '@/lib/constants'

const tabs = [
  { to: routes.info, label: 'Info', icon: Info },
  { to: routes.commitments, label: 'Commitments', icon: CheckSquare },
  { to: routes.opportunities, label: 'Opportunities', icon: Compass },
  { to: routes.timeline, label: 'Timeline', icon: Clock },
] as const

export function TabNav() {
  return (
    <nav className="flex justify-around sm:justify-center sm:gap-1">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/app'}
          className={({ isActive }) =>
            `flex items-center gap-2 border-b-2 px-4 py-2 font-satoshi text-sm font-medium transition-colors ${
              isActive
                ? 'border-neutral-950 text-neutral-950 dark:border-neutral-50 dark:text-neutral-50'
                : 'border-transparent text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50'
            }`
          }
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
