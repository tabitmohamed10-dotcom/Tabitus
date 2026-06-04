'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'

const maskData = (text: string) => text
  .replace(/(\+212|00212|0)([\s.-]?\d{2}){4}/g, '🚫 Numéro masqué par TABIT')
  .replace(/\b0[5-7]\d{8}\b/g, '🚫 Numéro masqué par TABIT')
  .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '🚫 Email masqué par TABIT')
  .replace(/(wa\.me|whatsapp|t\.me|telegram)[^\s]*/gi, '🚫 Lien masqué par TABIT')

export default function ChatPage() {
  const { offerId } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [offer, setOffer] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<any>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser(u)

      const { data: offerData } = await supabase
        .from('offers')
        .select('*, requests(*), merchants(business_name, phone)')
        .eq('id', offerId)
        .maybeSingle()
      setOffer(offerData)

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('offer_id', offerId)
        .order('created_at', { ascending: true })
      setMessages(msgs || [])
      setLoading(false)

      const channel = supabase.channel(`chat-${offerId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `offer_id=eq.${offerId}`,
        }, (payload) => {
          const msg = payload.new as any
          setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg])
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
        })
        .on('broadcast', { event: 'typing' }, ({ payload }) => {
          if (payload.user_id !== u.id) {
            setIsOtherTyping(true)
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 2500)
          }
        })
        .subscribe()

      channelRef.current = channel
    }

    init()
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [offerId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOtherTyping])

  const broadcastTyping = useCallback(() => {
    channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { user_id: user?.id } })
  }, [user?.id])

  async function sendMessage() {
    if (!newMessage.trim() || !user || sending) return
    const masked = maskData(newMessage.trim())
    setNewMessage('')
    setSending(true)
    await supabase.from('messages').insert({
      offer_id: offerId,
      sender_id: user.id,
      content: masked,
    })
    setSending(false)
    inputRef.current?.focus()
  }

  const merchantName = offer?.merchants?.business_name || 'Commerçant'
  const requestTitle = offer?.requests?.title || 'Demande'

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FAFAF7' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E8E0CC', borderTop: '3px solid #C9922A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#8A856E', fontSize: 14 }}>Chargement du chat...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#FAFAF7', fontFamily: 'var(--font-inter, system-ui)' }}>

      {/* Yellow warning banner */}
      <div style={{ background: '#FFF8E1', borderBottom: '1px solid #FFD700', padding: '10px 20px', display: 'flex', alignItems: 'flex-start', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
        <p style={{ fontSize: 12, color: '#8B6914', margin: 0, lineHeight: 1.5 }}>
          <strong>Coordonnées personnelles masquées automatiquement.</strong>{' '}
          Numéros de téléphone, emails et liens WhatsApp/Telegram sont remplacés par TABIT pour protéger votre transaction.
        </p>
      </div>

      {/* Header */}
      <div style={{ background: '#0C0B09', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #2A2820', flexShrink: 0 }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: '#C9922A', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}
        >
          ←
        </button>
        <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #8B6914, #C9922A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0C0B09', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {merchantName[0]?.toUpperCase() || 'T'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#F0E8D4', fontFamily: 'var(--font-playfair, Georgia)', fontSize: 15, margin: 0, fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{merchantName}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '2px 0 0', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Re: {requestTitle}</p>
        </div>
        {offer?.price && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ color: '#C9922A', fontFamily: 'var(--font-playfair, Georgia)', fontSize: 18, margin: 0 }}>{Number(offer.price).toLocaleString('fr-MA')} MAD</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '2px 0 0' }}>Offre acceptée</p>
          </div>
        )}
      </div>

      {/* Offer summary strip */}
      {offer && (
        <div style={{ background: '#F5F2EA', borderBottom: '1px solid #E8E0CC', padding: '10px 20px', display: 'flex', gap: 20, overflowX: 'auto', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: '#8A856E' }}>💰 Prix :</span>
            <span style={{ fontSize: 13, color: '#C9922A', fontWeight: 600 }}>{Number(offer.price).toLocaleString('fr-MA')} MAD</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: '#8A856E' }}>🚚 Livraison :</span>
            <span style={{ fontSize: 13, color: '#0C0B09' }}>{offer.delivery_days || 3} jours</span>
          </div>
          {offer.guarantee && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: '#8A856E' }}>🛡️ Garantie :</span>
              <span style={{ fontSize: 13, color: '#0C0B09' }}>{offer.guarantee}</span>
            </div>
          )}
        </div>
      )}

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', margin: 'auto' }}>
            <p style={{ fontSize: 44, marginBottom: 12 }}>💬</p>
            <p style={{ color: '#8A856E', fontSize: 14, fontWeight: 500 }}>Démarrez la conversation</p>
            <p style={{ color: '#C4BCA8', fontSize: 12, marginTop: 6 }}>Discutez des détails : livraison, conditions, modalités de paiement…</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender_id === user?.id
          const wasMasked = msg.content !== maskData(msg.content) || msg.content.includes('masqué par TABIT')
          return (
            <div key={msg.id || i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '72%',
                padding: '10px 14px',
                background: isMe ? '#0C0B09' : '#FFFFFF',
                color: isMe ? '#F0E8D4' : '#0C0B09',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                border: isMe ? '1px solid #2A2820' : '1px solid #E8E0CC',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, wordBreak: 'break-word' }}>{msg.content}</p>
                {wasMasked && (
                  <p style={{ fontSize: 10, color: isMe ? 'rgba(255,200,0,0.7)' : '#C9922A', margin: '4px 0 0', fontStyle: 'italic' }}>ℹ️ Information masquée</p>
                )}
                <p style={{ fontSize: 10, color: isMe ? 'rgba(255,255,255,0.3)' : '#C4BCA8', margin: '5px 0 0', textAlign: 'right' }}>
                  {new Date(msg.created_at).toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isOtherTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E8E0CC', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <div
                  key={i}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: '#C4BCA8', animation: `bounce 0.9s ease-in-out ${d}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ background: '#FFFFFF', borderTop: '1px solid #E8E0CC', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0, paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
        <textarea
          ref={inputRef}
          value={newMessage}
          onChange={e => { setNewMessage(e.target.value); broadcastTyping() }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder="Écrivez votre message…"
          rows={1}
          style={{ flex: 1, resize: 'none', border: '1px solid #E8E0CC', borderRadius: 12, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', minHeight: 44, maxHeight: 120, outline: 'none', background: '#FAFAF7', color: '#0C0B09', lineHeight: 1.5 }}
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim() || sending}
          style={{
            width: 44, height: 44, flexShrink: 0,
            background: newMessage.trim() && !sending ? 'linear-gradient(135deg, #8B6914, #C9922A)' : '#E8E0CC',
            border: 'none', borderRadius: 12,
            cursor: newMessage.trim() && !sending ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, transition: 'all 0.2s',
          }}
        >
          {sending ? '⏳' : '➤'}
        </button>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
