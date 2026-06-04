'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react'
import Logo from '@/app/components/Logo'

const SOCIAL_PROOF = [
  { text: '2 200 DH économisés en moyenne', sub: 'Fatima Z., Casablanca' },
  { text: 'Réponse en moins de 5 minutes', sub: 'Sur les demandes actives' },
  { text: '4.9/5 satisfaction commerçants', sub: '2 400+ boutiques certifiées' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault()
    if (!email || !password) { setError('Remplissez tous les champs'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      if (authError.message?.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter')
      } else {
        setError('Email ou mot de passe incorrect')
      }
      setLoading(false)
      return
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user!.id).single()
    window.location.href = profile?.role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer'
  }

  const inputCls = 'flex h-11 w-full border border-border/70 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 hover:border-border rounded-none'

  return (
    <div style={{minHeight:'100vh',display:'flex'}}>
      {/* Left panel */}
      <div style={{width:'42%',background:'#0C0B09',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:48,position:'relative',overflow:'hidden'}} className="hidden lg:flex">
        <div style={{position:'absolute',bottom:-20,right:-20,fontFamily:'var(--font-arabic)',fontSize:200,color:'rgba(191,160,106,0.04)',pointerEvents:'none',lineHeight:1}}>ثابت</div>
        <div style={{position:'absolute',top:0,right:0,width:300,height:300,background:'radial-gradient(circle,rgba(201,146,42,0.08) 0%,transparent 70%)',pointerEvents:'none'}} />

        <div style={{position:'relative',zIndex:1}}>
          <Link href="/"><Logo dark size="md" /></Link>
        </div>

        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'#C9922A',marginBottom:16,fontFamily:'var(--font-inter)'}}>Marketplace n°1 au Maroc</div>
          <h2 style={{fontFamily:'var(--font-playfair)',fontSize:40,fontWeight:400,color:'#F0E8D4',lineHeight:1.1,marginBottom:8}}>
            Le marché<br/><em style={{fontStyle:'italic',color:'#C9922A'}}>travaille</em><br/>pour vous.
          </h2>
          <p style={{fontFamily:'var(--font-arabic)',fontSize:16,color:'rgba(191,160,106,0.7)',textAlign:'right',marginTop:12,lineHeight:1.6}}>السوق يعمل من أجلك</p>

          <div style={{marginTop:40,display:'flex',flexDirection:'column',gap:16}}>
            {SOCIAL_PROOF.map((item, i) => (
              <div key={i} style={{display:'flex',gap:16,padding:'16px 20px',border:'1px solid rgba(191,160,106,0.15)',background:'rgba(201,146,42,0.04)'}}>
                <span style={{width:4,flexShrink:0,height:'auto',background:'linear-gradient(135deg,#8B6914,#C9922A)',borderRadius:2}} />
                <div>
                  <p style={{fontSize:13,color:'#F0E8D4',fontWeight:400,marginBottom:4}}>{item.text}</p>
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.35)',letterSpacing:'0.15em'}}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{position:'relative',zIndex:1}}>
          <p style={{fontSize:11,color:'rgba(255,255,255,0.25)',letterSpacing:'0.2em',fontFamily:'var(--font-inter)'}}>© 2025 TABIT · Maroc</p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px',background:'#FAFAF7'}}>
        <div style={{width:'100%',maxWidth:400}}>
          <div className="lg:hidden mb-10">
            <Link href="/"><Logo size="md" /></Link>
          </div>

          <div style={{marginBottom:32}}>
            <div className="s-label" style={{marginBottom:16}}>Connexion</div>
            <h1 style={{fontFamily:'var(--font-playfair)',fontSize:32,fontWeight:400,color:'#0C0B09',marginBottom:8}}>Bon retour</h1>
            <p style={{fontSize:14,color:'#8A856E',fontWeight:300}}>
              Pas de compte ?{' '}
              <Link href="/auth/register" style={{color:'#C9922A',textDecoration:'none',fontWeight:400}}>Créer un compte gratuit →</Link>
            </p>
          </div>

          {error && (
            <div style={{marginBottom:20,background:'#FEF2F2',border:'1px solid #FECACA',color:'#DC2626',padding:'12px 16px',fontSize:13}}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label style={{display:'block',fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#8A856E',marginBottom:8,fontFamily:'var(--font-inter)'}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#8A856E',pointerEvents:'none'}} />
                <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" autoFocus className={inputCls} style={{paddingLeft:44}} />
              </div>
            </div>

            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <label style={{fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#8A856E',fontFamily:'var(--font-inter)'}}>Mot de passe</label>
                <Link href="/auth/forgot-password" style={{fontSize:12,color:'#C9922A',textDecoration:'none'}}>Oublié ?</Link>
              </div>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#8A856E',pointerEvents:'none'}} />
                <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className={inputCls} style={{paddingLeft:44,paddingRight:44}} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#8A856E',padding:0}}>
                  {showPwd ? <EyeOff style={{width:16,height:16}} /> : <Eye style={{width:16,height:16}} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px 32px',marginTop:8,opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer',fontSize:11,letterSpacing:'0.25em'}}>
              {loading ? 'Connexion...' : <>Se connecter <ArrowRight style={{width:16,height:16}} /></>}
            </button>
          </form>

          <p style={{marginTop:32,textAlign:'center',fontSize:11,color:'#8A856E',lineHeight:1.6}}>
            En vous connectant, vous acceptez nos{' '}
            <Link href="#" style={{color:'#C9922A',textDecoration:'none'}}>CGU</Link>
            {' '}et notre{' '}
            <Link href="#" style={{color:'#C9922A',textDecoration:'none'}}>Politique de confidentialité</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
