import { Inbox, Sparkles, CheckSquare, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Step {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Capture',
    description: 'Add workspace items — information, opportunities, events, or announcements — from any source.',
    icon: Inbox,
  },
  {
    number: '02',
    title: 'Assess',
    description: "AI evaluates each item's actionability, determining what needs attention and what's informational.",
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Commit',
    description: 'Turn actionable items into tracked commitments with priorities, deadlines, and status tracking.',
    icon: CheckSquare,
  },
  {
    number: '04',
    title: 'Review',
    description: 'See everything on a unified timeline — overdue, upcoming, completed — sorted by what matters most.',
    icon: Clock,
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            How Workspace.ai Works
          </h3>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            A simple four-step workflow that turns scattered information into clear action.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <div
              key={number}
              className="rounded-lg border border-gray-200 p-6 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <span className="text-5xl font-bold text-indigo-600/20 dark:text-indigo-400/20">
                {number}
              </span>
              <Icon className="mt-3 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h4>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
