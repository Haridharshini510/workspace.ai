import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { MarqueeTicker } from '@/components/landing/MarqueeTicker'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ResultsSection } from '@/components/landing/ResultsSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <LandingNav />
      <HeroSection />
      <MarqueeTicker />
      <HowItWorksSection />
      <FeaturesSection />
      <ResultsSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
