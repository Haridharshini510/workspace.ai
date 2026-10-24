import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
      <h1 className="animate-hero-reveal w-full text-center font-satoshi text-[clamp(3.5rem,13.5vw,15rem)] font-black leading-[0.9] tracking-[-0.04em] text-neutral-950 dark:text-neutral-50">
        workspace.ai
      </h1>

      <p className="animate-hero-tagline mt-15 max-w-xl text-center font-newsreader text-xl leading-relaxed text-neutral-500 dark:text-neutral-400">
        Everything that matters, in one place.
      </p>

      <div className="animate-hero-cta mt-5">
        <Link
          to="/app"
          className="inline-block rounded-full bg-neutral-950 px-8 py-3 font-satoshi text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          Get started
        </Link>
      </div>
    </section>
  )
}
