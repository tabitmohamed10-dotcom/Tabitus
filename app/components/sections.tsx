import Link from 'next/link'
import Logo from './Logo'

export function MarqueeBand() {
  const items = ['Électroménager','Informatique','Ameublement','Matériaux de construction','Automobile','Bijouterie','B2B','الإلكترونيات','الأثاث','مواد البناء','Électroménager','Informatique','Ameublement','Matériaux','Automobile','Bijouterie','B2B','الإلكترونيات','الأثاث']
  return (
    <div style={{borderTop:'1px solid #E8E0CC',borderBottom:'1px solid #E8E0CC',overflow:'hidden',background:'#F5F2EA',padding:'14px 0'}}>
      <div className="marquee-inner">
        {items.map((item,i)=>(
          <span key={i} style={{display:'inline-flex',alignItems:'center',gap:16,marginRight:40,fontSize:10,letterSpacing:'0.35em',textTransform:'uppercase',color:'#8A856E',fontFamily:'var(--font-inter)'}}>
            <span style={{width:4,height:4,borderRadius:'50%',background:'#C9922A',display:'inline-block',flexShrink:0}}/>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

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
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:64,flexWrap:'wrap',gap:16}}>
        <h2 style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(36px,4vw,52px)',fontWeight:400,lineHeight:1.1,color:'#0C0B09'}}>
          Trois étapes.<br/><em style={{fontStyle:'italic',color:'#C9922A'}}>Zéro friction.</em>
        </h2>
        <p style={{fontFamily:'var(--font-arabic)',fontSize:18,color:'#C9922A',opacity:0.75,lineHeight:1.6}}>ثلاث خطوات. بدون تعقيد.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',border:'1px solid #E8E0CC'}}>
        {steps.map((s,i)=>(
          <div key={s.num} style={{padding:'40px 40px 48px',position:'relative',borderRight:i%2===0?'1px solid #E8E0CC':'none',borderBottom:i<2?'1px solid #E8E0CC':'none',transition:'background 0.3s',cursor:'default'}}
            onMouseEnter={e=>(e.currentTarget.style.background='#F5F2EA')}
            onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
            <div className="gold-text" style={{fontFamily:'var(--font-playfair)',fontSize:64,fontWeight:400,lineHeight:1,marginBottom:24,opacity:0.5}}>{s.num}</div>
            <h3 style={{fontFamily:'var(--font-playfair)',fontSize:20,fontWeight:400,color:'#0C0B09',marginBottom:4}}>{s.title}</h3>
            <p style={{fontFamily:'var(--font-arabic)',fontSize:13,color:'#C9922A',textAlign:'right',marginBottom:14,opacity:0.75,lineHeight:1.6}}>{s.ar}</p>
            <p style={{fontSize:14,lineHeight:1.85,color:'#6A6352',maxWidth:280,fontWeight:300}}>{s.desc}</p>
            <div style={{position:'absolute',bottom:24,right:24,width:32,height:32,border:'1px solid #E8E0CC',display:'flex',alignItems:'center',justifyContent:'center',color:'#8A856E',fontSize:13}}>→</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Features() {
  return (
    <section id="merchants" style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderBottom:'1px solid #E8E0CC'}}>
      <div style={{background:'#0C0B09',padding:'96px 56px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',bottom:-20,right:-20,fontFamily:'var(--font-arabic)',fontSize:160,color:'rgba(191,160,106,0.04)',pointerEvents:'none',lineHeight:1}}>ثابت</div>
        <div style={{position:'relative',zIndex:1}}>
          <div className="gold-text" style={{fontFamily:'var(--font-playfair)',fontSize:80,fontWeight:400,lineHeight:1,marginBottom:4}}>5%</div>
          <p style={{fontSize:11,letterSpacing:'0.3em',textTransform:'uppercase',color:'rgba(255,255,255,0.35)',marginBottom:48,fontFamily:'var(--font-inter)'}}>Commission uniquement sur succès</p>
          {[
            {icon:'◈',title:'Prix fixe — ثابت',desc:"Chaque offre est ferme, horodatée, traçable. Aucune mauvaise surprise après acceptation."},
            {icon:'◉',title:'Commerçants certifiés',desc:"Chaque vendeur est audité, documenté, noté par la communauté. Pignon sur rue garanti."},
            {icon:'◇',title:'Chat sans exposition',desc:"Numéros et emails masqués automatiquement. Vous communiquez sans divulguer vos coordonnées."},
          ].map((f,i,arr)=>(
            <div key={f.title} style={{display:'flex',gap:20,paddingBottom:28,marginBottom:28,borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.06)':'none'}}>
              <div style={{width:36,height:36,border:'1px solid rgba(191,160,106,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'#C9922A',fontSize:16,flexShrink:0}}>{f.icon}</div>
              <div>
                <p style={{fontSize:13,color:'#F0E8D4',marginBottom:6,letterSpacing:'0.05em'}}>{f.title}</p>
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
        <p style={{fontFamily:'var(--font-arabic)',fontSize:17,color:'#C9922A',textAlign:'right',marginBottom:48,opacity:0.75,lineHeight:1.6}}>صُمِّم للمتطلبين</p>
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

export function Testimonial() {
  return (
    <section style={{padding:'96px 56px',borderBottom:'1px solid #E8E0CC',textAlign:'center',background:'#FAFAF7'}}>
      <div className="s-label" style={{justifyContent:'center'}}>Ils nous font confiance</div>
      <blockquote style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(22px,3vw,34px)',fontWeight:400,fontStyle:'italic',color:'#0C0B09',lineHeight:1.55,maxWidth:680,margin:'48px auto 24px'}}>
        &ldquo;J&apos;ai publié ma demande un mardi matin. Le mercredi, j&apos;avais sept offres. J&apos;ai économisé 2 300 dirhams.&rdquo;
      </blockquote>
      <p style={{fontFamily:'var(--font-arabic)',fontSize:17,color:'#C9922A',maxWidth:560,margin:'0 auto 24px',lineHeight:1.7,opacity:0.8}}>
        &ldquo;نشرت طلبي صباح الثلاثاء. يوم الأربعاء، لدي سبع عروض. وفرت أكثر من ألفين درهم.&rdquo;
      </p>
      <p style={{fontSize:11,letterSpacing:'0.3em',textTransform:'uppercase',color:'#8A856E',fontFamily:'var(--font-inter)'}}>Karim B. — Casablanca · Client vérifié</p>
    </section>
  )
}

export function CTA() {
  return (
    <section id="b2b" style={{background:'#0C0B09',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,padding:'112px 56px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#C9922A,transparent)'}}/>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
        <span style={{fontFamily:'var(--font-arabic)',fontSize:300,color:'rgba(191,160,106,0.025)',lineHeight:1}}>ثابت</span>
      </div>
      <div style={{position:'relative',zIndex:1}}>
        <div className="s-label">Rejoindre TABIT</div>
        <h2 style={{fontFamily:'var(--font-playfair)',fontSize:'clamp(38px,5vw,58px)',fontWeight:400,lineHeight:1.05,color:'#F0E8D4',marginBottom:12}}>
          Prêt à laisser<br/><em style={{fontStyle:'italic',color:'#BFA06A'}}>le marché venir</em><br/>à vous ?
        </h2>
        <p style={{fontFamily:'var(--font-arabic)',fontSize:20,color:'#C9922A',textAlign:'right',marginBottom:32,opacity:0.8,lineHeight:1.6}}>هل أنت مستعد؟</p>
        <p style={{fontSize:15,lineHeight:1.85,maxWidth:400,marginBottom:48,fontWeight:300,color:'rgba(255,255,255,0.45)'}}>
          Des milliers d&apos;acheteurs et de commerçants marocains ont fait confiance à TABIT. Rejoignez le côté juste du marché.
        </p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <Link href="/auth/register" className="btn-gold">Déposer ma demande</Link>
          <Link href="/auth/register?role=merchant" className="btn-ghost-dark">Inscrire mon commerce</Link>
        </div>
      </div>
      <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',gap:20}}>
        {[
          {icon:'◈',title:'Pour les acheteurs',ar:'للمشترين',desc:"Publier une demande est gratuit. Vous ne payez que lorsque vous achetez — et uniquement si vous êtes satisfait."},
          {icon:'◉',title:'Pour les commerçants',ar:'للتجار',desc:"Accédez à des milliers d'acheteurs qualifiés. 5% uniquement sur transaction confirmée. Aucun abonnement."},
          {icon:'◇',title:'Pour les entreprises',ar:'للمقاولات',desc:"Module B2B dédié — appels d'offres, multi-utilisateurs, facturation pro. Accès prioritaire sur demande."},
        ].map(c=>(
          <div key={c.title} className="card-hover" style={{border:'1px solid rgba(191,160,106,0.2)',padding:24}}>
            <div style={{fontSize:20,color:'#C9922A',marginBottom:12}}>{c.icon}</div>
            <p style={{fontSize:13,color:'#F0E8D4',marginBottom:4}}>{c.title}</p>
            <p style={{fontFamily:'var(--font-arabic)',fontSize:12,color:'rgba(191,160,106,0.7)',textAlign:'right',marginBottom:10,lineHeight:1.6}}>{c.ar}</p>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',lineHeight:1.7,fontWeight:300}}>{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{background:'#FAFAF7',padding:56,borderTop:'1px solid #E8E0CC'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:48,flexWrap:'wrap',gap:40}}>
        <div>
          <Logo size="md"/>
          <p style={{fontFamily:'var(--font-arabic)',fontSize:13,color:'#C9922A',marginTop:8,marginBottom:16,lineHeight:1.6}}>ثابت — السوق يعمل من أجلك</p>
          <p style={{fontSize:10,letterSpacing:'0.25em',textTransform:'uppercase',color:'#8A856E',fontFamily:'var(--font-inter)'}}>Marketplace marocaine · Prix fixes garantis</p>
        </div>
        <div style={{display:'flex',gap:48,flexWrap:'wrap'}}>
          {[
            {h:'Plateforme',links:[['#how','Comment ça marche'],['/auth/register','Déposer une demande'],['/auth/register?role=merchant','Espace commerçant'],['#b2b','Module B2B']]},
            {h:'Entreprise',links:[['#','À propos'],['#','Presse'],['#','Carrières'],['#','Contact']]},
            {h:'Légal',links:[['#',"Conditions d'utilisation"],['#','Confidentialité'],['#','Cookies']]},
          ].map(col=>(
            <div key={col.h}>
              <h4 style={{fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:'#8A856E',fontFamily:'var(--font-inter)',fontWeight:500,marginBottom:16}}>{col.h}</h4>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
                {col.links.map(([href,label])=>(
                  <li key={label}>
                    <Link href={href} style={{fontSize:13,color:'#0C0B09',textDecoration:'none',fontWeight:300}}
                      onMouseEnter={e=>(e.currentTarget.style.color='#C9922A')}
                      onMouseLeave={e=>(e.currentTarget.style.color='#0C0B09')}>
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
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
        <p style={{fontSize:11,color:'#8A856E',fontFamily:'var(--font-inter)'}}>© 2025 TABIT · Tous droits réservés · Maroc</p>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',color:'#C9922A',border:'1px solid #C9922A',padding:'3px 10px'}}>5% commission</span>
          <span style={{fontSize:11,color:'#8A856E',fontFamily:'var(--font-inter)'}}>Uniquement sur transaction confirmée</span>
        </div>
      </div>
    </footer>
  )
}
