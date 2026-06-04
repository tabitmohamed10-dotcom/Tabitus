export default function DashboardLoading() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px' }}>
      <div style={{ height: 32, width: 200, borderRadius: 8, background: '#E8E0CC', marginBottom: 8, animation: 'shimmer 1.8s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, #E8E0CC 0%, #F5F2EA 50%, #E8E0CC 100%)' }} />
      <div style={{ height: 16, width: 140, borderRadius: 6, background: '#F0EBE0', marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ height: 110, borderRadius: 16, background: '#E8E0CC', animation: 'shimmer 1.8s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, #E8E0CC 0%, #F5F2EA 50%, #E8E0CC 100%)' }} />
        ))}
      </div>
      <div style={{ height: 88, borderRadius: 16, background: '#E8E0CC', marginBottom: 16, animation: 'shimmer 1.8s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, #E8E0CC 0%, #F5F2EA 50%, #E8E0CC 100%)' }} />
      <div style={{ height: 280, borderRadius: 16, background: '#E8E0CC', animation: 'shimmer 1.8s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, #E8E0CC 0%, #F5F2EA 50%, #E8E0CC 100%)' }} />
      <style>{`@keyframes shimmer { from { background-position: 200% 0 } to { background-position: -200% 0 } }`}</style>
    </div>
  )
}
