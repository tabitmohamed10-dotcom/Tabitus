import Navbar from '@/app/components/Navbar'
import Hero from '@/app/components/Hero'
import {
  MarqueeBand, StatsBar, Categories, HowItWorks,
  TrustBadges, FeaturedRequests, Features, MoroccoMap,
  Testimonial, CTA, Footer,
} from '@/app/components/sections'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MarqueeBand />
        <StatsBar />
        <Categories />
        <HowItWorks />
        <TrustBadges />
        <FeaturedRequests />
        <Features />
        <MoroccoMap />
        <Testimonial />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
