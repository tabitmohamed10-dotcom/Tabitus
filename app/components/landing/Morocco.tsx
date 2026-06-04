'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const CITIES = [
  { name: 'Casablanca', emoji: '🏙️', count: 680, pct: 100, region: 'Grand Casablanca' },
  { name: 'Rabat-Salé', emoji: '🏛️', count: 290, pct: 43, region: 'Rabat-Salé-Kénitra' },
  { name: 'Marrakech', emoji: '🌹', count: 245, pct: 36, region: 'Marrakech-Safi' },
  { name: 'Fès', emoji: '🕌', count: 210, pct: 31, region: 'Fès-Meknès' },
  { name: 'Tanger', emoji: '⚓', count: 195, pct: 29, region: 'Tanger-Tétouan-Al Hoceïma' },
  { name: 'Agadir', emoji: '🌊', count: 175, pct: 26, region: 'Souss-Massa' },
  { name: 'Meknès', emoji: '🏰', count: 140, pct: 21, region: 'Fès-Meknès' },
  { name: 'Oujda', emoji: '🌄', count: 120, pct: 18, region: 'Oriental' },
  { name: 'Laayoune', emoji: '🏜️', count: 85, pct: 13, region: 'Laâyoune-Sakia El Hamra' },
  { name: 'Dakhla', emoji: '🌅', count: 60, pct: 9, region: 'Dakhla-Oued Ed-Dahab' },
]

const CITY_DOTS = [
  { cx: 168, cy: 102, name: 'Casablanca', size: 9 },
  { cx: 155, cy: 85, name: 'Rabat', size: 6 },
  { cx: 195, cy: 158, name: 'Marrakech', size: 6 },
  { cx: 220, cy: 88, name: 'Fès', size: 5 },
  { cx: 115, cy: 60, name: 'Tanger', size: 5 },
  { cx: 142, cy: 212, name: 'Agadir', size: 5 },
  { cx: 208, cy: 97, name: 'Meknès', size: 4 },
  { cx: 292, cy: 92, name: 'Oujda', size: 4 },
  { cx: 155, cy: 265, name: 'Laayoune', size: 4 },
  { cx: 170, cy: 292, name: 'Dakhla', size: 3 },
]

function CityRow({ city, index }: { city: typeof CITIES[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', alignItems: 'center', gap: 10 }}
    >
      <span style={{ fontSize: 16, width: 22, flexShrink: 0 }}>{city.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#FAFAF7' }}>{city.name}</span>
            <span style={{ fontSize: 11, color: '#8A856E', marginLeft: 6 }}>{city.region}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#C9922A', flexShrink: 0, marginLeft: 8 }}>
            {city.count} commerçants
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: 'rgba(201,146,42,0.1)' }}>
          <motion.div
            style={{
              height: '100%', borderRadius: 3,
              background: 'linear-gradient(90deg, #8B6914, #C9922A, #E8B84B)',
            }}
            initial={{ width: '0%' }}
            animate={inView ? { width: `${city.pct}%` } : { width: '0%' }}
            transition={{ duration: 0.9, delay: index * 0.06 + 0.25, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function Morocco() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section style={{
      background: '#0C0B09',
      padding: 'clamp(56px,8vw,96px) clamp(20px,5vw,56px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: '#FAFAF7', marginBottom: 12, fontWeight: 400,
          }}>
            Disponible dans tout le Maroc
          </h2>
          <p style={{
            fontFamily: 'var(--font-arabic), serif',
            fontSize: 18, color: '#C9922A', direction: 'rtl', display: 'block', marginBottom: 12,
          }}>
            متوفر في جميع أنحاء المغرب
          </p>
          <p style={{ fontSize: 15, color: '#8A856E', maxWidth: 480, margin: '0 auto' }}>
            Notre réseau de 2 400+ commerçants couvre toutes les grandes villes et régions du Royaume
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'center',
        }} className="morocco-grid">
          {/* SVG Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', justifyContent: 'center' }}
            className="morocco-map"
          >
            <svg
              viewBox="0 0 400 340"
              style={{
                width: '100%', maxWidth: 400,
                filter: 'drop-shadow(0 0 48px rgba(201,146,42,0.12))',
              }}
            >
              {/* Morocco mainland silhouette */}
              <path
                d="M 60 35 L 130 28 L 180 32 L 230 35 L 285 38 L 330 50 L 350 75 L 355 110 L 345 145 L 360 175 L 345 210 L 320 240 L 285 262 L 255 275 L 220 280 L 185 272 L 158 258 L 130 240 L 100 218 L 72 192 L 52 162 L 42 130 L 45 95 L 52 68 Z"
                fill="#1A1812"
                stroke="rgba(201,146,42,0.35)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Southern provinces */}
              <path
                d="M 130 240 L 185 272 L 220 280 L 255 275 L 240 305 L 200 318 L 162 308 L 138 285 Z"
                fill="#151410"
                stroke="rgba(201,146,42,0.25)"
                strokeWidth="1"
                strokeDasharray="5 3"
              />
              <text x="190" y="305" fill="#8A856E" fontSize="8" fontFamily="var(--font-inter), sans-serif" textAnchor="middle">Sahara Marocain</text>

              {/* Radial glow at Casablanca */}
              <radialGradient id="casaGlow" cx="168" cy="102" r="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C9922A" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#C9922A" stopOpacity="0" />
              </radialGradient>
              <ellipse cx="168" cy="102" rx="40" ry="35" fill="url(#casaGlow)" />

              {/* City dots */}
              {CITY_DOTS.map((dot) => (
                <g key={dot.name}>
                  <motion.circle
                    cx={dot.cx} cy={dot.cy} r={dot.size + 4}
                    fill="rgba(201,146,42,0.08)"
                    animate={{ r: [dot.size + 4, dot.size + 8, dot.size + 4] }}
                    transition={{ duration: 2.5 + Math.random(), repeat: Infinity, delay: Math.random() * 1.5 }}
                  />
                  <motion.circle
                    cx={dot.cx} cy={dot.cy} r={dot.size}
                    fill="#C9922A"
                    animate={{ opacity: [0.9, 0.55, 0.9] }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
                  />
                  <text
                    x={dot.cx + dot.size + 5} y={dot.cy + 4}
                    fill="#C4BCA8" fontSize="8"
                    fontFamily="var(--font-inter), system-ui, sans-serif"
                  >
                    {dot.name}
                  </text>
                </g>
              ))}
            </svg>
          </motion.div>

          {/* City list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CITIES.map((city, i) => (
              <CityRow key={city.name} city={city} index={i} />
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.85 }}
              style={{
                fontSize: 13, color: '#8A856E',
                paddingTop: 12, borderTop: '1px solid rgba(201,146,42,0.1)',
                marginTop: 4,
              }}
            >
              + 20 autres villes couvertes à travers tout le Royaume du Maroc
            </motion.p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .morocco-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 1023px) {
          .morocco-map { display: none; }
        }
      `}</style>
    </section>
  )
}
