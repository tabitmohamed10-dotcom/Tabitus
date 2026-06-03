import Navbar from '@/app/components/Navbar'
import Hero from '@/app/components/Hero'
import { MarqueeBand, HowItWorks, Features, Testimonial, CTA, Footer } from '@/app/components/sections'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MarqueeBand />
        <HowItWorks />
        <Features />
        <Testimonial />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
