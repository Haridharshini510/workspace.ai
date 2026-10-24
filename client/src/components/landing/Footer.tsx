import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-6 dark:border-neutral-800">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 py-8 sm:flex-row lg:px-6">
        <Link
          to="/"
          className="font-satoshi text-sm font-bold tracking-tight text-neutral-950 dark:text-neutral-50"
        >
          workspace.ai
        </Link>
        <p className="font-newsreader text-sm text-neutral-400 dark:text-neutral-500">
          &copy; {new Date().getFullYear()} Workspace.ai
        </p>
      </div>
    </footer>
  )
}
