import { Link } from 'react-router-dom'
import { routes } from '@/lib/constants'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h2>
      <p className="text-gray-500 dark:text-gray-400">Page not found.</p>
      <Link
        to={routes.info}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Back to Home
      </Link>
    </div>
  )
}
