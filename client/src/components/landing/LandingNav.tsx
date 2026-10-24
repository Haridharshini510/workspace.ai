import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import logoImg from '@/assets/logo.png'

export function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl dark:bg-neutral-950/90'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-300 items-center justify-between px-6 py-5 lg:px-12">
        <Link to="/">
          <img
            src={logoImg}
            alt="Workspace.ai"
            className="h-20 w-auto dark:invert"
          />
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            to="/app"
            className="rounded-full border border-neutral-300 px-5 py-2 font-satoshi text-[0.8125rem] font-medium text-neutral-950 transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-white dark:border-neutral-700 dark:text-neutral-50 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
          >
            Sign in
          </Link>
          <Link
            to="/app"
            className="rounded-full bg-neutral-950 px-5 py-2 font-satoshi text-[0.8125rem] font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            Get started
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-neutral-950 dark:text-neutral-50"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-neutral-200 bg-white/95 px-6 pb-5 backdrop-blur-xl md:hidden dark:border-neutral-800 dark:bg-neutral-950/95">
          <Link
            to="/app"
            onClick={() => setMenuOpen(false)}
            className="mt-4 block rounded-full border border-neutral-300 px-5 py-2.5 text-center font-satoshi text-[0.8125rem] font-medium text-neutral-950 dark:border-neutral-700 dark:text-neutral-50"
          >
            Sign in
          </Link>
          <Link
            to="/app"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-full bg-neutral-950 px-5 py-2.5 text-center font-satoshi text-[0.8125rem] font-medium text-white dark:bg-neutral-50 dark:text-neutral-950"
          >
            Get started
          </Link>
        </div>
      )}
    </nav>
  )
}
