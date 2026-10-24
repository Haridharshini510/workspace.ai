import { Link } from 'react-router-dom'
import { useInView } from '@/hooks/use-in-view'

export function CtaSection() {
  const { ref, visible } = useInView<HTMLElement>(0.2)

  return (
    <section
      ref={ref}
      className="bg-neutral-950 px-2 py-10 lg:px-12 lg:py-14 dark:bg-neutral-50"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="mx-auto max-w-250 text-center">
        <h2 className="font-satoshi text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight tracking-tight text-white dark:text-neutral-950">
          Start organizing what matters.
        </h2>
        <p className="mx-auto mt-5 max-w-md font-newsreader text-lg text-neutral-400 dark:text-neutral-500">
          One workspace for your information, commitments, and deadlines.
        </p>
        <Link
          to="/app"
          className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-satoshi text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-800"
        >
          Get started
        </Link>
      </div>
    </section>
  )
}
