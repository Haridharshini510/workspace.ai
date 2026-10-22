import { Outlet } from 'react-router-dom'
import { TabNav } from './TabNav'
import { ThemeToggle } from './ThemeToggle'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold tracking-tight">Workspace.ai</h1>
          <ThemeToggle />
        </div>
        <div className="mx-auto hidden max-w-5xl sm:block">
          <TabNav />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-20 sm:pb-6">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white/80 backdrop-blur sm:hidden dark:border-gray-700 dark:bg-gray-900/80">
        <TabNav />
      </nav>
    </div>
  )
}
