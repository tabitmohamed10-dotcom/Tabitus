'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Logo from './Logo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    {href:'#how',label:'Comment ça marche'},
    {href:'#merchants',label:'Commerçants'},
    {href:'#b2b',label:'Entreprises B2B'},
  ]

  return (
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:50,height:68,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 56px',background:scrolled?'rgba(250,250,247,0.96)':'rgba(250,250,247,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid #E8E0CC',transition:'all 0.3s'}}>
      <Link href="/"><Logo /></Link>
      <ul style={{display:'flex',gap:40,listStyle:'none',alignItems:'center'}}>
        {links.map(l=>(
          <li key={l.href}>
            <Link href={l.href} style={{fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#8A856E',textDecoration:'none',fontFamily:'var(--font-inter)',transition:'color 0.2s'}}
              onMouseEnter={e=>(e.currentTarget.style.color='#0C0B09')}
              onMouseLeave={e=>(e.currentTarget.style.color='#8A856E')}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div style={{display:'flex',alignItems:'center',gap:24}}>
        <Link href="/auth/login" style={{fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase',color:'#8A856E',textDecoration:'none',fontFamily:'var(--font-inter)'}}>
          Connexion
        </Link>
        <Link href="/auth/register" className="btn-primary" style={{padding:'10px 22px',fontSize:10}}>
          Commencer
        </Link>
      </div>
    </nav>
  )
}
