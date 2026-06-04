'use client'
import Navbar from '@/app/components/Navbar'
import Hero from '@/app/components/landing/Hero'
import Marquee from '@/app/components/landing/Marquee'
import Stats from '@/app/components/landing/Stats'
import HowItWorks from '@/app/components/landing/HowItWorks'
import Categories from '@/app/components/landing/Categories'
import ForWhom from '@/app/components/landing/ForWhom'
import LiveRequests from '@/app/components/landing/LiveRequests'
import Morocco from '@/app/components/landing/Morocco'
import Trust from '@/app/components/landing/Trust'
import Testimonials from '@/app/components/landing/Testimonials'
import FAQ from '@/app/components/landing/FAQ'
import FinalCTA from '@/app/components/landing/FinalCTA'
import Footer from '@/app/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ overflowX: 'hidden' }}>
        <Hero />
        <Marquee />
        <Stats />
        <HowItWorks />
        <Categories />
        <ForWhom />
        <LiveRequests />
        <Morocco />
        <Trust />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
