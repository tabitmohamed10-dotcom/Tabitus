'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{minHeight:'100vh',background:'#FAFAF7',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{textAlign:'center',maxWidth:400}}>
        <p style={{fontSize:48,marginBottom:16}}>⚠️</p>
        <h1 style={{fontFamily:'var(--font-playfair)',fontSize:28,color:'#0C0B09',marginBottom:12}}>Une erreur est survenue</h1>
        <p style={{color:'#8A856E',fontSize:14,marginBottom:8}}>{error?.message || 'Quelque chose s\'est mal passé'}</p>
        <p style={{color:'#C4BCA8',fontSize:11,marginBottom:24,fontFamily:'monospace'}}>{error?.stack?.split('\n')[0]}</p>
        {error?.digest && (
          <p style={{color:'#C4BCA8',fontSize:10,marginBottom:16,fontFamily:'monospace'}}>digest: {error.digest}</p>
        )}
        <div style={{display:'flex',gap:12,justifyContent:'center'}}>
          <button onClick={reset} style={{background:'linear-gradient(135deg,#8B6914,#C9922A)',color:'#0C0B09',border:'none',padding:'12px 24px',fontSize:12,letterSpacing:'0.2em',textTransform:'uppercase',fontWeight:600,cursor:'pointer'}}>Réessayer</button>
          <Link href="/" style={{display:'inline-block',border:'1px solid #C9922A',color:'#C9922A',padding:'12px 24px',fontSize:12,letterSpacing:'0.2em',textTransform:'uppercase',textDecoration:'none'}}>Accueil</Link>
        </div>
      </div>
    </div>
  )
}
