import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-36">
      <h2 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-gray-100">
        Your Workspace, Intelligently Organized
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
        Capture information, track commitments, and never miss a deadline — powered by AI that understands what matters.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          to="/app"
          className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Get Started
        </Link>
        <a
          href="#how-it-works"
          className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          See How It Works
        </a>
      </div>

      <div className="mx-auto mt-14 flex max-w-md items-center justify-center gap-6 text-sm text-gray-400 sm:gap-8 dark:text-gray-500">
        <span>4 Item Types</span>
        <span className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
        <span>AI-Powered Insights</span>
        <span className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
        <span>Smart Timelines</span>
      </div>
    </section>
  )
}