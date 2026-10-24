import { Link } from 'react-router-dom'
import { routes } from '@/lib/constants'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="font-satoshi text-4xl font-bold text-neutral-950 dark:text-neutral-50">404</h2>
      <p className="font-newsreader text-neutral-500 dark:text-neutral-400">Page not found.</p>
      <Link
        to={routes.info}
        className="rounded-full bg-neutral-950 px-5 py-2 font-satoshi text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
      >
        Back to Home
      </Link>
    </div>
  )
}
