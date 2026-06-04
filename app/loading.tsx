export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#FAFAF7', gap: 20,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: 'linear-gradient(135deg, #8B6914, #C9922A, #E8B84B)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0C0B09', fontSize: 22,
        boxShadow: '0 4px 20px rgba(201,146,42,0.4)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>T</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%', background: '#C9922A',
            animation: `bounce 0.9s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.8;transform:scale(0.97)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  )
}
