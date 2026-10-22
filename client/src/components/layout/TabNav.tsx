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
    <nav className="flex justify-around border-b border-gray-200 px-4 sm:justify-start sm:gap-1 dark:border-gray-700">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
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
