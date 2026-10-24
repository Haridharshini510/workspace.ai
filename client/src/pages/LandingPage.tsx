import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <ProcessSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
