import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { TabNav } from './TabNav'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import logoImg from '@/assets/logo.png'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl dark:bg-neutral-950/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/">
            <img
              src={logoImg}
              alt="Workspace.ai"
              className="h-20 w-auto dark:invert"
            />
          </Link>

          <div className="hidden sm:block">
            <TabNav />
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 pb-20 sm:pb-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-neutral-200 bg-white/90 backdrop-blur-xl sm:hidden dark:border-neutral-800 dark:bg-neutral-950/90">
        <TabNav />
      </nav>
    </div>
  )
}
