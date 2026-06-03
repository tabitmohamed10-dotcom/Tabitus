interface LogoProps { size?: 'sm'|'md'|'lg'; dark?: boolean }
export default function Logo({ size='md', dark=false }: LogoProps) {
  const h = {sm:28,md:36,lg:52}[size]
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,userSelect:'none'}}>
      <svg width={h*0.85} height={h} viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0D080"/><stop offset="45%" stopColor="#C9922A"/>
            <stop offset="75%" stopColor="#D4B483"/><stop offset="100%" stopColor="#8B6914"/>
          </linearGradient>
        </defs>
        <polygon points="15,28 28,36 2,36" fill="none" stroke="url(#lg)" strokeWidth="0.8"/>
        <rect x="14.2" y="10" width="1.6" height="18" fill="url(#lg)"/>
        <rect x="4" y="10" width="22" height="1.4" rx="0.7" fill="url(#lg)"/>
        <line x1="8" y1="11.4" x2="8" y2="20" stroke="url(#lg)" strokeWidth="0.9"/>
        <line x1="3" y1="20" x2="13" y2="20" stroke="url(#lg)" strokeWidth="1.2"/>
        <line x1="22" y1="11.4" x2="22" y2="20" stroke="url(#lg)" strokeWidth="0.9"/>
        <line x1="17" y1="20" x2="27" y2="20" stroke="url(#lg)" strokeWidth="1.2"/>
        <circle cx="10" cy="4" r="2.2" fill="url(#lg)"/>
        <circle cx="15" cy="1.5" r="2.2" fill="url(#lg)"/>
        <circle cx="20" cy="4" r="2.2" fill="url(#lg)"/>
        <circle cx="15" cy="10" r="2.6" fill="url(#lg)"/>
        <circle cx="15" cy="10" r="1.1" fill={dark?'#0C0B09':'#FAFAF7'}/>
        <rect x="4" y="34" width="22" height="1.6" rx="0.8" fill="url(#lg)"/>
      </svg>
      <div style={{display:'flex',flexDirection:'column',gap:1}}>
        <span className="gold-text" style={{fontFamily:'var(--font-playfair)',fontSize:h*0.52,letterSpacing:'0.35em',lineHeight:1,fontWeight:400}}>TABIT</span>
        <span style={{fontFamily:'var(--font-arabic)',fontSize:h*0.28,color:'#C9922A',lineHeight:1,textAlign:'right',opacity:0.85}}>ثابت</span>
      </div>
    </div>
  )
}
