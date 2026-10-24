import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/use-in-view'

const steps = [
  {
    number: '01',
    title: 'Capture',
    description:
      'Collect information, opportunities, events, and announcements from any source into your workspace.',
  },
  {
    number: '02',
    title: 'Assess',
    description:
      "AI evaluates what needs your attention and what’s purely informational — so you focus on what matters.",
  },
  {
    number: '03',
    title: 'Commit',
    description:
      'Turn actionable items into tracked commitments with priorities, deadlines, and clear ownership.',
  },
  {
    number: '04',
    title: 'Review',
    description:
      'See everything on a unified timeline — overdue, upcoming, completed — sorted by urgency.',
  },
]

function DesktopProcess() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [sectionVisible, setSectionVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const sectionHeight = rect.height - window.innerHeight
      if (sectionHeight <= 0) return

      setSectionVisible(rect.top < window.innerHeight * 0.5)

      const progress = -rect.top / sectionHeight
      const clamped = Math.max(0, Math.min(1, progress))
      const step = Math.min(steps.length - 1, Math.floor(clamped * steps.length))
      setActiveStep(step)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="relative hidden lg:block" style={{ height: `${steps.length * 85}vh` }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-[1200px] px-12">
          <div className="flex gap-20">
            <div
              className="w-2/5 transition-opacity duration-700"
              style={{ opacity: sectionVisible ? 1 : 0 }}
            >
              <p className="font-newsreader text-lg italic text-neutral-400 dark:text-neutral-500">
                With workspace.ai you can
              </p>
              <div className="relative mt-6 h-40 overflow-hidden">
                {steps.map((step, i) => (
                  <span
                    key={step.number}
                    className="absolute left-0 top-0 font-satoshi text-[9rem] font-light leading-none tracking-tight transition-all duration-700"
                    style={{
                      opacity: i === activeStep ? 0.12 : 0,
                      transform: i === activeStep ? 'translateY(0)' : i < activeStep ? 'translateY(-40px)' : 'translateY(40px)',
                    }}
                  >
                    <span className="text-neutral-950 dark:text-neutral-50">{step.number}</span>
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className="h-0.5 w-8 rounded-full transition-colors duration-500"
                    style={{
                      backgroundColor: i <= activeStep
                        ? 'var(--step-active)'
                        : 'var(--step-inactive)',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative min-h-[240px] flex-1">
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{
                    opacity: i === activeStep ? 1 : 0,
                    transform: i === activeStep
                      ? 'translateY(0)'
                      : i < activeStep
                        ? 'translateY(-48px)'
                        : 'translateY(48px)',
                    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: i === activeStep ? 'auto' : 'none',
                  }}
                >
                  <h3 className="font-satoshi text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-neutral-950 dark:text-neutral-50">
                    {step.title}
                  </h3>
                  <p className="mt-6 max-w-md font-newsreader text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileStepItem({ step }: { step: (typeof steps)[number] }) {
  const { ref, visible } = useInView<HTMLDivElement>(0.2)
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <span className="font-satoshi text-5xl font-light text-neutral-950/10 dark:text-neutral-50/10">
        {step.number}
      </span>
      <h3 className="mt-3 font-satoshi text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
        {step.title}
      </h3>
      <p className="mt-4 max-w-md font-newsreader text-[1.0625rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
        {step.description}
      </p>
    </div>
  )
}

function MobileProcess() {
  return (
    <div className="lg:hidden">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="font-newsreader text-lg italic text-neutral-400 dark:text-neutral-500">
          With workspace.ai you can
        </p>
        <div className="mt-12 space-y-16">
          {steps.map((step) => (
            <MobileStepItem key={step.number} step={step} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProcessSection() {
  return (
    <section className="py-4 lg:py-0">
      <DesktopProcess />
      <MobileProcess />
    </section>
  )
}
