export default function AuthError() {
  return (
    <div style={{minHeight:'100vh',background:'#0C0B09',display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'var(--font-inter)'}}>
      <div style={{background:'#FAFAF7',padding:40,maxWidth:400,width:'100%',textAlign:'center'}}>
        <p style={{fontSize:40,marginBottom:16}}>⚠️</p>
        <h1 style={{fontFamily:'var(--font-playfair)',fontSize:24,color:'#0C0B09',marginBottom:12}}>Lien expiré</h1>
        <p style={{color:'#8A856E',fontSize:14,marginBottom:24}}>Ce lien de confirmation a expiré ou est invalide. Reconnectez-vous pour recevoir un nouveau lien.</p>
        <a href="/auth/login" style={{display:'block',background:'linear-gradient(135deg,#8B6914,#C9922A)',color:'#0C0B09',padding:'12px 24px',textDecoration:'none',fontSize:12,letterSpacing:'0.2em',textTransform:'uppercase',fontWeight:600}}>Se connecter</a>
      </div>
    </div>
  )
}
