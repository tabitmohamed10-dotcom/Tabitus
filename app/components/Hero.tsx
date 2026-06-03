"use client"
"use client"
'use client'
import Link from 'next/link'

export default function Hero() {
  return (
    <section style={{minHeight:'calc(100vh - 68px)',marginTop:68,display:'grid',gridTemplateColumns:'1fr 1fr'}}>

      {/* LEFT */}
      <div style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'80px 56px',borderRight:'1px solid #E8E0CC',position:'relative',overflow:'hidden',background:'#FAFAF7'}}>
        <span aria-hidden style={{position:'absolute',right:-40,top:'50%',transform:'translateY(-50%)',fontFamily:'var(--font-arabic)',fontSize:280,color:'rgba(191,160,106,0.06)',pointerEvents:'none',lineHeight:1,zIndex:0}}>ث</span>

        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:48,position:'relative',zIndex:1}}>
          <span style={{width:32,height:1,background:'#C9922A',display:'block'}}/>
          <span style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'#C9922A',fontFamily:'var(--font-inter)'}}>Marketplace n°1 au Maroc</span>
        </div>

        <h1 style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(52px,6vw,76px)',fontWeight:400,lineHeight:1.0,color:'#0C0B09',marginBottom:16,position:'relative',zIndex:1}}>
          Le marché<br/>
          <em className="gold-text" style={{fontStyle:'normal',display:'block'}}>travaille</em>
          pour vous.
        </h1>

        <p style={{fontFamily:'var(--font-arabic)',fontSize:22,color:'#C9922A',textAlign:'right',marginBottom:36,opacity:0.85,lineHeight:1.6,position:'relative',zIndex:1}}>
          السوق يعمل من أجلك
        </p>

        <p style={{fontSize:15,lineHeight:1.85,color:'#5A5545',maxWidth:420,marginBottom:48,fontWeight:300,position:'relative',zIndex:1}}>
          Finissez de chercher. Publiez votre besoin en 30 secondes —
          les meilleurs commerçants du Maroc vous font leurs offres.
          Vous comparez. Vous choisissez.{' '}
          <strong style={{fontWeight:500,color:'#0C0B09'}}>Le prix est fixe, la confiance est garantie.</strong>
        </p>

        <div style={{display:'flex',gap:12,marginBottom:64,position:'relative',zIndex:1,flexWrap:'wrap'}}>
          <Link href="/auth/register" className="btn-primary">Déposer ma demande</Link>
          <Link href="/auth/register?role=merchant" className="btn-outline">Je suis commerçant →</Link>
        </div>

        <div style={{display:'flex',gap:0,position:'relative',zIndex:1}}>
          {[['2 400+','Commerçants vérifiés'],['< 5 min','Première offre'],['18 000+','Transactions']].map(([n,l],i)=>(
            <div key={l} style={{paddingRight:32,marginRight:32,borderRight:i<2?'1px solid #E8E0CC':'none'}}>
              <div className="gold-text" style={{fontFamily:'var(--font-playfair)',fontSize:32,fontWeight:400,lineHeight:1,marginBottom:4}}>{n}</div>
              <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'#8A856E',fontFamily:'var(--font-inter)'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{background:'#0C0B09',display:'flex',flexDirection:'column',justifyContent:'center',padding:'60px 48px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-200,right:-200,width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(191,160,106,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>

        <p style={{display:'flex',alignItems:'center',gap:10,fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#C9922A',marginBottom:32,position:'relative',zIndex:1}}>
          <span style={{width:20,height:1,background:'#C9922A',display:'block'}}/>
          En ce moment sur TABIT
        </p>

        <div className="card-hover" style={{border:'1px solid rgba(191,160,106,0.2)',background:'rgba(255,255,255,0.03)',padding:28,marginBottom:20,position:'relative',zIndex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
            <span style={{fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase',color:'#C9922A',background:'rgba(191,160,106,0.1)',border:'1px solid rgba(191,160,106,0.2)',padding:'5px 12px'}}>Électroménager</span>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>Il y a 3 min</span>
          </div>
          <h3 style={{fontFamily:'var(--font-playfair)',fontSize:18,fontWeight:400,color:'#F0E8D4',marginBottom:4}}>Réfrigérateur Samsung 500L</h3>
          <p style={{fontFamily:'var(--font-arabic)',fontSize:13,color:'rgba(191,160,106,0.7)',textAlign:'right',marginBottom:12,lineHeight:1.6}}>ثلاجة سامسونغ ٥٠٠ لتر</p>
          <p style={{fontSize:13,color:'rgba(255,255,255,0.4)',lineHeight:1.6,marginBottom:16}}>Garantie 2 ans · Casablanca, Maârif · Livraison incluse</p>
          <div style={{display:'flex',gap:8,marginBottom:20}}>
            {['Casablanca','Livraison','Urgent'].map(t=>(
              <span key={t} style={{fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',padding:'4px 10px',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.35)'}}>{t}</span>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:16}}>
            <p style={{fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase',color:'#C9922A',marginBottom:12}}>3 offres reçues</p>
            {[
              {name:'Électro Atlas',rating:'4.9',price:'6 800',best:false},
              {name:'Darcom Pro',rating:'5.0',price:'6 450',best:true},
              {name:'Marjane Pro',rating:'4.7',price:'7 100',best:false},
            ].map(o=>(
              <div key={o.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',marginBottom:8,background:o.best?'rgba(191,160,106,0.08)':'rgba(255,255,255,0.03)',borderLeft:`2px solid ${o.best?'#C9922A':'transparent'}`}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:13,color:'rgba(255,255,255,0.7)',fontWeight:300}}>{o.name}</span>
                  <span style={{fontSize:10,color:'#C9922A'}}>★ {o.rating}</span>
                  {o.best&&<span style={{fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',background:'rgba(191,160,106,0.15)',color:'#BFA06A',padding:'2px 8px'}}>Meilleure offre</span>}
                </div>
                <div style={{fontFamily:'var(--font-playfair)',fontSize:17,color:'#F0E8D4'}}>
                  {o.price} <span style={{fontSize:10,color:'#8A856E',letterSpacing:'0.2em'}}>MAD</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p style={{fontSize:11,color:'rgba(255,255,255,0.2)',textAlign:'center',letterSpacing:'0.1em',position:'relative',zIndex:1}}>
          Rejoignez 2 400+ commerçants vérifiés
        </p>
      </div>
    </section>
  )
}
