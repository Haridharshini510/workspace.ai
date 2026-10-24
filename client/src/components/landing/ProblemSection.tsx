import { useInView } from '@/hooks/use-in-view'
import type { ReactNode } from 'react'

function FadeIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function ScatteredIllustration() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className="w-full max-w-xs" aria-hidden="true">
      <circle cx="45" cy="60" r="8" className="fill-neutral-200 dark:fill-neutral-800" />
      <circle cx="180" cy="35" r="12" className="fill-neutral-300 dark:fill-neutral-700" />
      <circle cx="270" cy="80" r="6" className="fill-neutral-200 dark:fill-neutral-800" />
      <circle cx="90" cy="150" r="10" className="fill-neutral-300 dark:fill-neutral-700" />
      <circle cx="220" cy="170" r="14" className="fill-neutral-200 dark:fill-neutral-800" />
      <circle cx="140" cy="100" r="5" className="fill-neutral-300 dark:fill-neutral-700" />
      <circle cx="300" cy="140" r="7" className="fill-neutral-200 dark:fill-neutral-800" />
      <circle cx="60" cy="200" r="9" className="fill-neutral-200 dark:fill-neutral-800" />
      <line x1="45" y1="60" x2="140" y2="100" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="180" y1="35" x2="220" y2="170" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="90" y1="150" x2="60" y2="200" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1" strokeDasharray="4 4" />
      <rect x="110" y="75" width="60" height="50" rx="4" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" fill="none" opacity="0.6" />
      <rect x="200" y="110" width="50" height="40" rx="4" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" fill="none" opacity="0.4" transform="rotate(8 225 130)" />
      <rect x="30" y="100" width="45" height="35" rx="4" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" fill="none" opacity="0.5" transform="rotate(-5 52 117)" />
    </svg>
  )
}

function FadingTimelineIllustration() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className="w-full max-w-xs" aria-hidden="true">
      <line x1="40" y1="120" x2="280" y2="120" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="2" />
      <circle cx="80" cy="120" r="8" className="fill-neutral-300 dark:fill-neutral-700" />
      <circle cx="140" cy="120" r="8" className="fill-neutral-300 dark:fill-neutral-700" opacity="0.7" />
      <circle cx="200" cy="120" r="8" className="fill-neutral-200 dark:fill-neutral-800" opacity="0.4" />
      <circle cx="260" cy="120" r="8" className="fill-neutral-200 dark:fill-neutral-800" opacity="0.15" />
      <line x1="80" y1="100" x2="80" y2="90" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" />
      <rect x="62" y="68" width="36" height="20" rx="3" className="fill-neutral-100 stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700" strokeWidth="1" />
      <line x1="140" y1="140" x2="140" y2="150" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" opacity="0.7" />
      <rect x="122" y="152" width="36" height="20" rx="3" className="fill-neutral-100 stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700" strokeWidth="1" opacity="0.5" />
      <path d="M200 95 L200 80" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
      <circle cx="160" cy="40" r="24" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" fill="none" opacity="0.3" />
      <line x1="160" y1="40" x2="160" y2="24" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" opacity="0.3" />
      <line x1="160" y1="40" x2="172" y2="46" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" opacity="0.3" />
    </svg>
  )
}

function OverlappingPanelsIllustration() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className="w-full max-w-xs" aria-hidden="true">
      <g opacity="0.4" transform="rotate(-4 120 100)">
        <rect x="60" y="50" width="120" height="100" rx="6" className="fill-neutral-100 stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700" strokeWidth="1.5" />
        <line x1="76" y1="75" x2="148" y2="75" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" />
        <line x1="76" y1="90" x2="136" y2="90" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />
        <line x1="76" y1="105" x2="144" y2="105" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />
      </g>
      <g opacity="0.6" transform="rotate(2 180 110)">
        <rect x="120" y="60" width="120" height="100" rx="6" className="fill-neutral-50 stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700" strokeWidth="1.5" />
        <line x1="136" y1="85" x2="208" y2="85" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" />
        <line x1="136" y1="100" x2="196" y2="100" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />
        <line x1="136" y1="115" x2="204" y2="115" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />
      </g>
      <g opacity="0.8" transform="rotate(-1 200 130)">
        <rect x="140" y="80" width="120" height="100" rx="6" className="fill-white stroke-neutral-300 dark:fill-neutral-950 dark:stroke-neutral-700" strokeWidth="1.5" />
        <line x1="156" y1="105" x2="228" y2="105" className="stroke-neutral-300 dark:stroke-neutral-700" strokeWidth="1.5" />
        <line x1="156" y1="120" x2="216" y2="120" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />
        <line x1="156" y1="135" x2="224" y2="135" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

const problems = [
  {
    title: 'Your information lives in a dozen places',
    description:
      'Notes in one app, emails in another, bookmarks scattered across browsers. You spend more time searching than doing.',
    illustration: <ScatteredIllustration />,
  },
  {
    title: 'Deadlines pass before you see them',
    description:
      "By the time you remember that hackathon, internship, or event deadline, it has already passed. Opportunities don’t wait.",
    illustration: <FadingTimelineIllustration />,
  },
  {
    title: 'No single source of truth',
    description:
      "Without one view of what’s coming, priorities blur. Important things get buried under everything else.",
    illustration: <OverlappingPanelsIllustration />,
  },
]

export function ProblemSection() {
  return (
    <section className="px-6 py-2 lg:px-12 lg:py-3">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <h2 className="max-w-2xl font-satoshi text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-tight tracking-tight text-neutral-950 dark:text-neutral-50">
            Information without structure is just noise
          </h2>
        </FadeIn>

        <div className="mt-8 space-y-10 lg:mt-10 lg:space-y-12">
          {problems.map((problem, i) => (
            <FadeIn key={problem.title} delay={0.05}>
              <div
                className={`flex flex-col items-center gap-12 lg:flex-row lg:gap-20 ${
                  i % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-satoshi text-xl font-semibold text-neutral-950 sm:text-2xl dark:text-neutral-50">
                    {problem.title}
                  </h3>
                  <p className="mt-4 max-w-lg font-newsreader text-[1.0625rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {problem.description}
                  </p>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="float-gentle">{problem.illustration}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
