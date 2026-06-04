'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Mail, Lock, User } from 'lucide-react'
import Logo from '@/app/components/Logo'

const BENEFITS = {
  buyer: [
    { text: 'Économisez en moyenne 25%' },
    { text: 'Réponses en moins de 5 min' },
    { text: 'Commerçants certifiés' },
    { text: '100% gratuit pour les acheteurs' },
  ],
  merchant: [
    { text: 'Clients qualifiés & prêts à acheter' },
    { text: 'Aucune dépense publicitaire' },
    { text: 'Construisez votre réputation' },
    { text: '5% uniquement sur transaction confirmée' },
  ],
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const initialRole = ((searchParams.get('role') || searchParams.get('type')) as 'buyer' | 'merchant') || 'buyer'
  const router = useRouter()
  const [role, setRole] = useState<'buyer' | 'merchant'>(initialRole)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e?: React.FormEvent) {
    e?.preventDefault()
    if (!fullName || !email || !password) { setError('Remplissez tous les champs'); return }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role } } })
    if (authError) { setError(authError.message); setLoading(false); return }
    router.push(role === 'merchant' ? '/dashboard/merchant' : '/dashboard/buyer')
  }

  const inputCls = 'flex h-11 w-full border border-border/70 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 hover:border-border rounded-none'

  return (
    <div style={{minHeight:'100vh',display:'flex'}}>
      {/* Left panel */}
      <div style={{width:'42%',background:'#0C0B09',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:48,position:'relative',overflow:'hidden'}} className="hidden lg:flex">
        <div style={{position:'absolute',bottom:-20,right:-20,fontFamily:'var(--font-arabic)',fontSize:200,color:'rgba(191,160,106,0.04)',pointerEvents:'none',lineHeight:1}}>ثابت</div>

        <div style={{position:'relative',zIndex:1}}>
          <Link href="/"><Logo dark size="md" /></Link>
        </div>

        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'#C9922A',marginBottom:8,fontFamily:'var(--font-inter)'}}>
            {role === 'buyer' ? 'Pour les acheteurs' : 'Pour les commerçants'}
          </div>
          <h2 style={{fontFamily:'var(--font-playfair)',fontSize:40,fontWeight:400,color:'#F0E8D4',lineHeight:1.1,marginBottom:24}}>
            {role === 'buyer' ? <>Arrêtez de<br/>chercher.<br/><em style={{color:'#C9922A'}}>Laissez-les</em><br/>venir à vous.</> : <>Des clients.<br/>Sans<br/><em style={{color:'#C9922A'}}>publicité.</em></>}
          </h2>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {BENEFITS[role].map((item, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{width:4,height:4,borderRadius:'50%',background:'#C9922A',flexShrink:0}} />
                <span style={{fontSize:13,color:'rgba(255,255,255,0.7)',fontWeight:300}}>{item.text}</span>
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
        <div style={{width:'100%',maxWidth:420}}>
          <div className="lg:hidden mb-10">
            <Link href="/"><Logo size="md" /></Link>
          </div>

          <div style={{marginBottom:28}}>
            <div className="s-label" style={{marginBottom:16}}>Inscription</div>
            <h1 style={{fontFamily:'var(--font-playfair)',fontSize:32,fontWeight:400,color:'#0C0B09',marginBottom:8}}>Créer un compte</h1>
            <p style={{fontSize:14,color:'#8A856E',fontWeight:300}}>
              Déjà inscrit ?{' '}
              <Link href="/auth/login" style={{color:'#C9922A',textDecoration:'none',fontWeight:400}}>Se connecter →</Link>
            </p>
          </div>

          {/* Role selector */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
            {(['buyer', 'merchant'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  padding:'16px 12px',
                  border: role === r ? '2px solid #C9922A' : '2px solid #E8E0CC',
                  background: role === r ? 'rgba(201,146,42,0.06)' : '#FFFFFF',
                  cursor:'pointer',
                  textAlign:'left',
                  transition:'all 0.2s',
                }}
              >
                <div style={{fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color: role === r ? '#C9922A' : '#8A856E',marginBottom:6,fontFamily:'var(--font-inter)'}}>
                  {r === 'buyer' ? 'Acheteur' : 'Commerçant'}
                </div>
                <div style={{fontSize:12,color:'#0C0B09',fontWeight:300}}>
                  {r === 'buyer' ? 'Publier des demandes' : 'Répondre aux demandes'}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div style={{marginBottom:16,background:'#FEF2F2',border:'1px solid #FECACA',color:'#DC2626',padding:'12px 16px',fontSize:13}}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={{display:'block',fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#8A856E',marginBottom:8,fontFamily:'var(--font-inter)'}}>Nom complet</label>
              <div style={{position:'relative'}}>
                <User style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#8A856E',pointerEvents:'none'}} />
                <input type="text" placeholder="Votre nom complet" value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" autoFocus className={inputCls} style={{paddingLeft:44}} />
              </div>
            </div>
            <div>
              <label style={{display:'block',fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#8A856E',marginBottom:8,fontFamily:'var(--font-inter)'}}>Email</label>
              <div style={{position:'relative'}}>
                <Mail style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#8A856E',pointerEvents:'none'}} />
                <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className={inputCls} style={{paddingLeft:44}} />
              </div>
            </div>
            <div>
              <label style={{display:'block',fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#8A856E',marginBottom:8,fontFamily:'var(--font-inter)'}}>Mot de passe</label>
              <div style={{position:'relative'}}>
                <Lock style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#8A856E',pointerEvents:'none'}} />
                <input type={showPwd ? 'text' : 'password'} placeholder="8 caractères minimum" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" className={inputCls} style={{paddingLeft:44,paddingRight:44}} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#8A856E',padding:0}}>
                  {showPwd ? <EyeOff style={{width:16,height:16}} /> : <Eye style={{width:16,height:16}} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px 32px',marginTop:4,opacity:loading?0.7:1,cursor:loading?'not-allowed':'pointer',fontSize:11,letterSpacing:'0.25em'}}>
              {loading ? 'Création...' : <>Créer mon compte {role === 'buyer' ? 'acheteur' : 'commerçant'} <ArrowRight style={{width:16,height:16}} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#FAFAF7'}}><div style={{width:32,height:32,borderRadius:'50%',border:'2px solid #C9922A',borderTopColor:'transparent',animation:'spin 1s linear infinite'}} /></div>}>
      <RegisterForm />
    </Suspense>
  )
}
