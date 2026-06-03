'use client'
import Link from 'next/link'
import Logo from './Logo'

/* ── MarqueeBand ─────────────────────────────────────────────── */
export function MarqueeBand() {
  const items = ['Électroménager','Informatique','Ameublement','Matériaux de construction','Automobile','Bijouterie','B2B','الإلكترونيات','الأثاث','مواد البناء','Électroménager','Informatique','Ameublement','Matériaux','Automobile','Bijouterie','B2B','الإلكترونيات','الأثاث']
  return (
    <div style={{borderTop:'1px solid #E8E0CC',borderBottom:'1px solid #E8E0CC',overflow:'hidden',background:'#F5F2EA',padding:'14px 0'}}>
      <div className="marquee-inner">
        {items.map((item,i)=>(
          <span key={i} style={{display:'inline-flex',alignItems:'center',gap:16,marginRight:40,fontSize:10,letterSpacing:'0.35em',textTransform:'uppercase' as const,color:'#8A856E',fontFamily:'var(--font-inter)'}}>
            <span style={{width:4,height:4,borderRadius:'50%',background:'#C9922A',display:'inline-block',flexShrink:0}}/>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── StatsBar ────────────────────────────────────────────────── */
export function StatsBar() {
  const stats = [
    { n: '2 400+', label: 'Commerçants vérifiés', ar: 'تاجر موثوق' },
    { n: '18 000+', label: 'Transactions réalisées', ar: 'صفقة منجزة' },
    { n: '< 5 min', label: 'Première offre reçue', ar: 'أول عرض' },
    { n: '5%', label: 'Commission seulement', ar: 'عمولة فقط' },
  ]
  return (
    <section style={{borderBottom:'1px solid #E8E0CC',background:'#0C0B09'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
        {stats.map((s,i)=>(
          <div key={s.n} style={{padding:'40px 32px',borderRight:i<3?'1px solid rgba(255,255,255,0.06)':'none',textAlign:'center' as const}}>
            <div className="gold-text" style={{fontFamily:'var(--font-playfair)',fontSize:40,fontWeight:400,lineHeight:1,marginBottom:8}}>{s.n}</div>
            <p style={{fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.4)',marginBottom:4,fontFamily:'var(--font-inter)'}}>{s.label}</p>
            <p style={{fontFamily:'var(--font-arabic)',fontSize:12,color:'rgba(191,160,106,0.5)',lineHeight:1.6}}>{s.ar}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Categories ──────────────────────────────────────────────── */
export function Categories() {
  const cats = [
    {icon:'🏠',label:'Électroménager',ar:'الكهروضغطي'},
    {icon:'💻',label:'Informatique',ar:'المعلوميات'},
    {icon:'🛋️',label:'Ameublement',ar:'الأثاث'},
    {icon:'🚗',label:'Automobile',ar:'السيارات'},
    {icon:'🔧',label:'BTP & Matériaux',ar:'البناء'},
    {icon:'💎',label:'Bijouterie',ar:'المجوهرات'},
    {icon:'👗',label:'Mode & Textile',ar:'الأزياء'},
    {icon:'🛒',label:'Alimentaire',ar:'الغذاء'},
    {icon:'⚙️',label:'Services Pro',ar:'خدمات'},
    {icon:'🏢',label:'B2B & Entreprises',ar:'الشركات'},
  ]
  return (
    <section style={{padding:'96px 56px',borderBottom:'1px solid #E8E0CC',background:'#FAFAF7'}}>
      <div className="s-label">Catégories</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:48,flexWrap:'wrap' as const,gap:16}}>
        <h2 style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(32px,4vw,48px)',fontWeight:400,lineHeight:1.1,color:'#0C0B09'}}>
          Tout ce dont vous avez<br/><em style={{fontStyle:'italic',color:'#C9922A'}}>besoin.</em>
        </h2>
        <Link href="/auth/register" style={{fontSize:11,letterSpacing:'0.25em',textTransform:'uppercase' as const,color:'#C9922A',textDecoration:'none',borderBottom:'1px solid #C9922A',paddingBottom:2}}>
          Voir toutes les catégories →
        </Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:1,background:'#E8E0CC',border:'1px solid #E8E0CC'}}>
        {cats.map(cat=>(
          <div key={cat.label} className="category-card" style={{background:'#FAFAF7',padding:'32px 24px',display:'flex',flexDirection:'column' as const,alignItems:'center',gap:12,textAlign:'center' as const}}>
            <span className="cat-icon" style={{fontSize:32}}>{cat.icon}</span>
            <div>
              <p className="cat-label" style={{fontSize:12,fontWeight:500,color:'#0C0B09',letterSpacing:'0.02em',marginBottom:4}}>{cat.label}</p>
              <p style={{fontFamily:'var(--font-arabic)',fontSize:11,color:'#8A856E',lineHeight:1.6}}>{cat.ar}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── HowItWorks ──────────────────────────────────────────────── */
export function HowItWorks() {
  const steps = [
    {num:'01',title:'Publiez votre besoin',ar:'انشر طلبك',desc:"Décrivez ce que vous cherchez — produit, quantité, ville, délai. Gratuit, sans engagement. 30 secondes chrono."},
    {num:'02',title:'Les offres viennent à vous',ar:'العروض تأتي إليك',desc:"Notre réseau de 2 400 commerçants certifiés reçoit votre demande instantanément. Les meilleures offres en quelques minutes."},
    {num:'03',title:'Comparez et décidez',ar:'قارن وقرر',desc:"Prix, délai, réputation, notes — tout est transparent. Échangez via notre chat sécurisé. Aucune donnée exposée."},
    {num:'04',title:'Transaction garantie',ar:'معاملة مضمونة',desc:"Paiement sécurisé. 5% de commission uniquement sur transaction confirmée. Votre argent ne bouge que si vous êtes satisfait."},
  ]
  return (
    <section id="how" style={{padding:'96px 56px',borderBottom:'1px solid #E8E0CC',background:'#FAFAF7'}}>
      <div className="s-label">Le processus</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:64,flexWrap:'wrap' as const,gap:16}}>
        <h2 style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(36px,4vw,52px)',fontWeight:400,lineHeight:1.1,color:'#0C0B09'}}>
          Trois étapes.<br/><em style={{fontStyle:'italic',color:'#C9922A'}}>Zéro friction.</em>
        </h2>
        <p style={{fontFamily:'var(--font-arabic)',fontSize:18,color:'#C9922A',opacity:0.75,lineHeight:1.6}}>ثلاث خطوات. بدون تعقيد.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',border:'1px solid #E8E0CC'}}>
        {steps.map((s,i)=>(
          <div key={s.num} style={{padding:'40px 40px 48px',position:'relative' as const,borderRight:i%2===0?'1px solid #E8E0CC':'none',borderBottom:i<2?'1px solid #E8E0CC':'none'}}>
            <div className="gold-text" style={{fontFamily:'var(--font-playfair)',fontSize:64,fontWeight:400,lineHeight:1,marginBottom:24,opacity:0.5}}>{s.num}</div>
            <h3 style={{fontFamily:'var(--font-playfair)',fontSize:20,fontWeight:400,color:'#0C0B09',marginBottom:4}}>{s.title}</h3>
            <p style={{fontFamily:'var(--font-arabic)',fontSize:13,color:'#C9922A',textAlign:'right' as const,marginBottom:14,opacity:0.75,lineHeight:1.6}}>{s.ar}</p>
            <p style={{fontSize:14,lineHeight:1.85,color:'#6A6352',maxWidth:280,fontWeight:300}}>{s.desc}</p>
            <div style={{position:'absolute' as const,bottom:24,right:24,width:32,height:32,border:'1px solid #E8E0CC',display:'flex',alignItems:'center',justifyContent:'center',color:'#8A856E',fontSize:13}}>→</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── TrustBadges ─────────────────────────────────────────────── */
export function TrustBadges() {
  const badges = [
    {icon:'◈',title:'Commerçants vérifiés',desc:'Chaque vendeur est audité, documenté, noté par la communauté.'},
    {icon:'◉',title:'Paiement sécurisé',desc:'Transaction protégée. Votre argent ne bouge que si vous êtes satisfait.'},
    {icon:'◇',title:'Prix fixe garanti',desc:'Chaque offre est ferme, horodatée, traçable. Aucune mauvaise surprise.'},
    {icon:'◆',title:'Support 7j/7',desc:'Une équipe dédiée pour accompagner acheteurs et commerçants.'},
  ]
  return (
    <section style={{borderBottom:'1px solid #E8E0CC',background:'#F5F2EA'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
        {badges.map((b,i)=>(
          <div key={b.title} style={{padding:'40px 32px',borderRight:i<3?'1px solid #E8E0CC':'none',display:'flex',gap:16,alignItems:'flex-start'}}>
            <span style={{fontSize:20,color:'#C9922A',flexShrink:0,marginTop:2}}>{b.icon}</span>
            <div>
              <p style={{fontSize:13,fontWeight:500,color:'#0C0B09',marginBottom:6}}>{b.title}</p>
              <p style={{fontSize:12,color:'#8A856E',lineHeight:1.7,fontWeight:300}}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── FeaturedRequests ────────────────────────────────────────── */
export function FeaturedRequests() {
  const requests = [
    {
      category:'Électroménager',time:'Il y a 2 min',title:'Réfrigérateur Samsung 500L No Frost',ar:'ثلاجة سامسونغ ٥٠٠ لتر',
      city:'Casablanca',tags:['Urgent','Livraison'],offers:3,
      bids:[{name:'Électro Atlas',stars:'4.9',price:'6 800',best:false},{name:'Darcom Pro',stars:'5.0',price:'6 450',best:true},{name:'Marjane Pro',stars:'4.7',price:'7 100',best:false}],
    },
    {
      category:'Informatique',time:'Il y a 8 min',title:'MacBook Pro M3 14" 16Go RAM 512Go',ar:'ماك بوك برو M3',
      city:'Rabat',tags:['Neuf','Garantie'],offers:5,
      bids:[{name:'iStore Maroc',stars:'4.8',price:'18 500',best:false},{name:'Tech Palace',stars:'5.0',price:'17 200',best:true},{name:'DigiWorld',stars:'4.6',price:'19 000',best:false}],
    },
    {
      category:'Automobile',time:'Il y a 15 min',title:'Pneus 205/55 R16 — lot de 4',ar:'إطارات ٢٠٥/٥٥ R١٦',
      city:'Marrakech',tags:['Pro','Montage inclus'],offers:4,
      bids:[{name:'AutoPneu Pro',stars:'4.7',price:'2 800',best:false},{name:'Speedy Maroc',stars:'5.0',price:'2 450',best:true},{name:'Vulco Gueliz',stars:'4.8',price:'2 950',best:false}],
    },
  ]
  return (
    <section style={{padding:'96px 56px',borderBottom:'1px solid #E8E0CC',background:'#0C0B09',position:'relative' as const,overflow:'hidden'}}>
      <div style={{position:'absolute' as const,top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#C9922A,transparent)'}}/>
      <div className="s-label">En ce moment sur TABIT</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:48,flexWrap:'wrap' as const,gap:16}}>
        <h2 style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(32px,4vw,48px)',fontWeight:400,lineHeight:1.1,color:'#F0E8D4'}}>
          Des acheteurs attendent<br/><em style={{fontStyle:'italic',color:'#C9922A'}}>votre offre.</em>
        </h2>
        <Link href="/auth/register?role=merchant" style={{fontSize:11,letterSpacing:'0.25em',textTransform:'uppercase' as const,color:'#C9922A',textDecoration:'none',borderBottom:'1px solid #C9922A',paddingBottom:2}}>
          Voir toutes les demandes →
        </Link>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
        {requests.map((req,ri)=>(
          <div key={ri} className="card-hover" style={{border:'1px solid rgba(191,160,106,0.2)',background:'rgba(255,255,255,0.03)',padding:24}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
              <span style={{fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase' as const,color:'#C9922A',background:'rgba(191,160,106,0.1)',border:'1px solid rgba(191,160,106,0.2)',padding:'4px 10px'}}>{req.category}</span>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.3)'}}>{req.time}</span>
            </div>
            <h3 style={{fontFamily:'var(--font-playfair)',fontSize:16,fontWeight:400,color:'#F0E8D4',marginBottom:4}}>{req.title}</h3>
            <p style={{fontFamily:'var(--font-arabic)',fontSize:12,color:'rgba(191,160,106,0.6)',textAlign:'right' as const,marginBottom:10,lineHeight:1.6}}>{req.ar}</p>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,flexWrap:'wrap' as const}}>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>📍 {req.city}</span>
              {req.tags.map(t=>(
                <span key={t} style={{fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase' as const,padding:'3px 8px',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.3)'}}>{t}</span>
              ))}
            </div>
            <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:14}}>
              <p style={{fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase' as const,color:'#C9922A',marginBottom:10}}>{req.offers} offres reçues</p>
              {req.bids.map(o=>(
                <div key={o.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',marginBottom:6,background:o.best?'rgba(191,160,106,0.08)':'rgba(255,255,255,0.02)',borderLeft:`2px solid ${o.best?'#C9922A':'transparent'}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:12,color:'rgba(255,255,255,0.65)',fontWeight:300}}>{o.name}</span>
                    <span style={{fontSize:10,color:'#C9922A'}}>★ {o.stars}</span>
                    {o.best&&<span style={{fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase' as const,background:'rgba(191,160,106,0.15)',color:'#BFA06A',padding:'2px 6px'}}>Meilleure</span>}
                  </div>
                  <span style={{fontFamily:'var(--font-playfair)',fontSize:14,color:'#F0E8D4'}}>{o.price} <span style={{fontSize:9,color:'#8A856E'}}>MAD</span></span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Features ────────────────────────────────────────────────── */
export function Features() {
  return (
    <section id="merchants" style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderBottom:'1px solid #E8E0CC'}}>
      <div style={{background:'#0C0B09',padding:'96px 56px',position:'relative' as const,overflow:'hidden'}}>
        <div style={{position:'absolute' as const,bottom:-20,right:-20,fontFamily:'var(--font-arabic)',fontSize:160,color:'rgba(191,160,106,0.04)',pointerEvents:'none',lineHeight:1}}>ثابت</div>
        <div style={{position:'relative' as const,zIndex:1}}>
          <div className="gold-text" style={{fontFamily:'var(--font-playfair)',fontSize:80,fontWeight:400,lineHeight:1,marginBottom:4}}>5%</div>
          <p style={{fontSize:11,letterSpacing:'0.3em',textTransform:'uppercase' as const,color:'rgba(255,255,255,0.35)',marginBottom:48,fontFamily:'var(--font-inter)'}}>Commission uniquement sur succès</p>
          {[
            {icon:'◈',title:'Prix fixe — ثابت',desc:"Chaque offre est ferme, horodatée, traçable. Aucune mauvaise surprise après acceptation."},
            {icon:'◉',title:'Commerçants certifiés',desc:"Chaque vendeur est audité, documenté, noté par la communauté. Pignon sur rue garanti."},
            {icon:'◇',title:'Chat sans exposition',desc:"Numéros et emails masqués automatiquement. Vous communiquez sans divulguer vos coordonnées."},
          ].map((f,i,arr)=>(
            <div key={f.title} style={{display:'flex',gap:20,paddingBottom:28,marginBottom:28,borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
              <div style={{width:36,height:36,border:'1px solid rgba(191,160,106,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'#C9922A',fontSize:16,flexShrink:0}}>{f.icon}</div>
              <div>
                <p style={{fontSize:13,color:'#F0E8D4',marginBottom:6}}>{f.title}</p>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',lineHeight:1.7,fontWeight:300}}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:'96px 56px',background:'#FAFAF7'}}>
        <div className="s-label">Pourquoi TABIT</div>
        <h2 style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(36px,4vw,52px)',fontWeight:400,lineHeight:1.1,color:'#0C0B09',marginBottom:12}}>
          Conçu pour<br/><em style={{fontStyle:'italic',color:'#C9922A'}}>l&apos;exigence</em><br/>marocaine.
        </h2>
        <p style={{fontFamily:'var(--font-arabic)',fontSize:17,color:'#C9922A',textAlign:'right' as const,marginBottom:48,opacity:0.75,lineHeight:1.6}}>صُمِّم للمتطلبين</p>
        <ul style={{listStyle:'none'}}>
          {[
            {r:'I',title:"Le pouvoir passe à l'acheteur",desc:"C'est le marché qui se déplace — pas vous. Les commerçants se battent pour vous convaincre."},
            {r:'II',title:'Couverture nationale',desc:"De Tanger à Laayoune. Toutes les villes, toutes les régions. Le meilleur prix n'est pas forcément à côté."},
            {r:'III',title:'B2C · B2B · B2G',desc:"Particuliers, entreprises, administrations. Une plateforme pour tous les achats, adaptée à chaque besoin."},
          ].map((f,i)=>(
            <li key={f.r} style={{display:'flex',gap:16,padding:'20px 0',borderTop:i===0?'1px solid #E8E0CC':'none',borderBottom:'1px solid #E8E0CC'}}>
              <span style={{fontFamily:'var(--font-playfair)',fontSize:13,color:'#C9922A',marginTop:2,minWidth:20}}>{f.r}</span>
              <div>
                <p style={{fontSize:14,fontWeight:500,color:'#0C0B09',marginBottom:6}}>{f.title}</p>
                <p style={{fontSize:13,color:'#8A856E',lineHeight:1.75,fontWeight:300}}>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── MoroccoMap ──────────────────────────────────────────────── */
export function MoroccoMap() {
  const cities = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Kénitra','Tétouan','El Jadida','Nador','Beni Mellal','Safi','Mohammedia','Laâyoune','Dakhla','Ifrane','Essaouira','Chefchaouen']
  return (
    <section style={{padding:'96px 56px',borderBottom:'1px solid #E8E0CC',background:'#FAFAF7',textAlign:'center' as const}}>
      <div className="s-label" style={{justifyContent:'center'}}>Couverture nationale</div>
      <h2 style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(32px,4vw,48px)',fontWeight:400,lineHeight:1.1,color:'#0C0B09',marginBottom:12}}>
        Disponible dans toutes<br/>les villes du <em style={{fontStyle:'italic',color:'#C9922A'}}>Maroc.</em>
      </h2>
      <p style={{fontFamily:'var(--font-arabic)',fontSize:18,color:'#C9922A',marginBottom:48,opacity:0.75,lineHeight:1.6}}>متاح في جميع مدن المغرب</p>
      <div style={{display:'flex',flexWrap:'wrap' as const,gap:8,justifyContent:'center',maxWidth:760,margin:'0 auto 48px'}}>
        {cities.map(city=>(
          <span key={city} style={{fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase' as const,padding:'8px 16px',border:'1px solid #E8E0CC',color:'#8A856E',fontFamily:'var(--font-inter)'}}>
            {city}
          </span>
        ))}
      </div>
      <p style={{fontSize:13,color:'#8A856E',fontWeight:300}}>
        Et en expansion continue — <Link href="/auth/register" style={{color:'#C9922A',textDecoration:'none'}}>rejoignez la liste d&apos;attente →</Link>
      </p>
    </section>
  )
}

/* ── Testimonial ─────────────────────────────────────────────── */
export function Testimonial() {
  return (
    <section style={{padding:'96px 56px',borderBottom:'1px solid #E8E0CC',textAlign:'center' as const,background:'#FAFAF7'}}>
      <div className="s-label" style={{justifyContent:'center'}}>Ils nous font confiance</div>
      <blockquote style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(22px,3vw,34px)',fontWeight:400,fontStyle:'italic',color:'#0C0B09',lineHeight:1.55,maxWidth:680,margin:'48px auto 24px'}}>
        &ldquo;J&apos;ai publié ma demande un mardi matin. Le mercredi, j&apos;avais sept offres. J&apos;ai économisé 2 300 dirhams.&rdquo;
      </blockquote>
      <p style={{fontFamily:'var(--font-arabic)',fontSize:17,color:'#C9922A',maxWidth:560,margin:'0 auto 24px',lineHeight:1.7,opacity:0.8}}>
        &ldquo;نشرت طلبي صباح الثلاثاء. يوم الأربعاء، لدي سبع عروض. وفرت أكثر من ألفين درهم.&rdquo;
      </p>
      <p style={{fontSize:11,letterSpacing:'0.3em',textTransform:'uppercase' as const,color:'#8A856E',fontFamily:'var(--font-inter)'}}>Karim B. — Casablanca · Client vérifié</p>
    </section>
  )
}

/* ── CTA ─────────────────────────────────────────────────────── */
export function CTA() {
  return (
    <section id="b2b" style={{background:'#0C0B09',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,padding:'112px 56px',position:'relative' as const,overflow:'hidden'}}>
      <div style={{position:'absolute' as const,top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#C9922A,transparent)'}}/>
      <div style={{position:'absolute' as const,inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
        <span style={{fontFamily:'var(--font-arabic)',fontSize:300,color:'rgba(191,160,106,0.025)',lineHeight:1}}>ثابت</span>
      </div>
      <div style={{position:'relative' as const,zIndex:1}}>
        <div className="s-label">Rejoindre TABIT</div>
        <h2 style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(38px,5vw,58px)',fontWeight:400,lineHeight:1.05,color:'#F0E8D4',marginBottom:12}}>
          Prêt à laisser<br/><em style={{fontStyle:'italic',color:'#BFA06A'}}>le marché venir</em><br/>à vous ?
        </h2>
        <p style={{fontFamily:'var(--font-arabic)',fontSize:20,color:'#C9922A',textAlign:'right' as const,marginBottom:32,opacity:0.8,lineHeight:1.6}}>هل أنت مستعد؟</p>
        <p style={{fontSize:15,lineHeight:1.85,maxWidth:400,marginBottom:48,fontWeight:300,color:'rgba(255,255,255,0.45)'}}>
          Des milliers d&apos;acheteurs et de commerçants marocains ont fait confiance à TABIT. Rejoignez le côté juste du marché.
        </p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap' as const}}>
          <Link href="/auth/register" className="btn-gold">Déposer ma demande</Link>
          <Link href="/auth/register?role=merchant" className="btn-ghost-dark">Inscrire mon commerce</Link>
        </div>
      </div>
      <div style={{position:'relative' as const,zIndex:1,display:'flex',flexDirection:'column' as const,gap:20}}>
        {[
          {icon:'◈',title:'Pour les acheteurs',ar:'للمشترين',desc:"Publier une demande est gratuit. Vous ne payez que lorsque vous achetez — et uniquement si vous êtes satisfait."},
          {icon:'◉',title:'Pour les commerçants',ar:'للتجار',desc:"Accédez à des milliers d'acheteurs qualifiés. 5% uniquement sur transaction confirmée. Aucun abonnement."},
          {icon:'◇',title:'Pour les entreprises',ar:'للمقاولات',desc:"Module B2B dédié — appels d'offres, multi-utilisateurs, facturation pro. Accès prioritaire sur demande."},
        ].map(c=>(
          <div key={c.title} style={{border:'1px solid rgba(191,160,106,0.2)',padding:24}}>
            <div style={{fontSize:20,color:'#C9922A',marginBottom:12}}>{c.icon}</div>
            <p style={{fontSize:13,color:'#F0E8D4',marginBottom:4}}>{c.title}</p>
            <p style={{fontFamily:'var(--font-arabic)',fontSize:12,color:'rgba(191,160,106,0.7)',textAlign:'right' as const,marginBottom:10,lineHeight:1.6}}>{c.ar}</p>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',lineHeight:1.7,fontWeight:300}}>{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Footer ──────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer style={{background:'#FAFAF7',padding:56,borderTop:'1px solid #E8E0CC'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:48,flexWrap:'wrap' as const,gap:40}}>
        <div>
          <Logo size="md"/>
          <p style={{fontFamily:'var(--font-arabic)',fontSize:13,color:'#C9922A',marginTop:8,marginBottom:16,lineHeight:1.6}}>ثابت — السوق يعمل من أجلك</p>
          <p style={{fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase' as const,color:'#8A856E',fontFamily:'var(--font-inter)'}}>Marketplace marocaine · Prix fixes garantis</p>
          <div style={{marginTop:24,display:'flex',gap:0,maxWidth:280}}>
            <input type="email" placeholder="votre@email.com" style={{flex:1,border:'1px solid #E8E0CC',background:'#FFFFFF',padding:'10px 14px',fontSize:12,color:'#0C0B09',outline:'none',fontFamily:'var(--font-inter)'}} />
            <button style={{background:'#C9922A',color:'#0C0B09',border:'none',padding:'10px 16px',fontSize:9,letterSpacing:'0.25em',textTransform:'uppercase' as const,cursor:'pointer',fontFamily:'var(--font-inter)',fontWeight:500,flexShrink:0}}>
              S&apos;abonner
            </button>
          </div>
          <p style={{fontSize:10,color:'#8A856E',marginTop:8,fontFamily:'var(--font-inter)'}}>Actualités TABIT · Pas de spam.</p>
        </div>
        <div style={{display:'flex',gap:48,flexWrap:'wrap' as const}}>
          {[
            {h:'Plateforme',links:[['#how','Comment ça marche'],['/auth/register','Déposer une demande'],['/auth/register?role=merchant','Espace commerçant'],['#b2b','Module B2B']]},
            {h:'Entreprise',links:[['#','À propos'],['#','Presse'],['#','Carrières'],['#','Contact']]},
            {h:'Légal',links:[['#',"Conditions d'utilisation"],['#','Confidentialité'],['#','Cookies']]},
          ].map(col=>(
            <div key={col.h}>
              <h4 style={{fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase' as const,color:'#8A856E',fontFamily:'var(--font-inter)',fontWeight:500,marginBottom:16}}>{col.h}</h4>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column' as const,gap:10}}>
                {col.links.map(([href,label])=>(
                  <li key={label}>
                    <Link href={href} style={{fontSize:13,color:'#0C0B09',textDecoration:'none',fontWeight:300}}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="h-divider" style={{marginBottom:24}}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap' as const,gap:12}}>
        <p style={{fontSize:11,color:'#8A856E',fontFamily:'var(--font-inter)'}}>© 2025 TABIT · Tous droits réservés · Maroc</p>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase' as const,color:'#C9922A',border:'1px solid #C9922A',padding:'3px 10px'}}>5% commission</span>
          <span style={{fontSize:11,color:'#8A856E',fontFamily:'var(--font-inter)'}}>Uniquement sur transaction confirmée</span>
        </div>
      </div>
    </footer>
  )
}
