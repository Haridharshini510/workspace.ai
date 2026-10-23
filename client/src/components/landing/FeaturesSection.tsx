import { TrendingUp, Zap, Calendar } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

const features: Feature[] = [
  {
    title: 'Smart Prioritization',
    description: 'AI-driven priority scoring that adapts to deadlines and item importance.',
    icon: TrendingUp,
  },
  {
    title: 'Commitment Generation',
    description: 'One click turns opportunities into trackable commitments with auto-generated details.',
    icon: Zap,
  },
  {
    title: 'Unified Timeline',
    description: 'See commitments and workspace items together, categorized by urgency and status.',
    icon: Calendar,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h3 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Everything You Need to Stay on Track
        </h3>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
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
