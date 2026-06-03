'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { playMessageSound } from '@/lib/utils/sound'
import { ArrowLeft, Send, Shield, Lock } from 'lucide-react'

function maskSensitiveInfo(text: string): { masked: string; hasPhone: boolean } {
  const phoneRegex = /(\+212|0)([ \-]?)([5-7]\d{8}|\d{9})/g
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const whatsappRegex = /whatsapp|watsap|watsapp|واتساب/gi
  const hasPhone = phoneRegex.test(text) || emailRegex.test(text) || whatsappRegex.test(text)
  const masked = hasPhone
    ? text
        .replace(/(\+212|0)([ \-]?)([5-7]\d{8}|\d{9})/g, '🔒 [Numéro masqué]')
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '🔒 [Email masqué]')
        .replace(/whatsapp|watsap|watsapp|واتساب/gi, '🔒 [Contact masqué]')
    : text
  return { masked, hasPhone }
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.9 }}
      className="flex items-end gap-2 mb-1"
    >
      <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
        {[0, 0.18, 0.36].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.9, delay, ease: 'easeInOut' }}
            className="h-2 w-2 bg-muted-foreground/60 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  const { offerId } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const [offer, setOffer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [warning, setWarning] = useState(false)
  const [isOtherTyping, setIsOtherTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<any>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/auth/login'); return }
      setUser(u)

      const { data: offerData } = await supabase
        .from('offers')
        .select('*, request:requests(title, buyer_id), merchant:merchants(business_name, user_id)')
        .eq('id', offerId)
        .single()
      setOffer(offerData)

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('offer_id', offerId)
        .order('created_at', { ascending: true })
      setMessages(msgs || [])
      setLoading(false)

      const channel = supabase
        .channel(`chat-${offerId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `offer_id=eq.${offerId}`,
        }, payload => {
          const msg = payload.new
          if (msg.sender_id !== u.id) {
            playMessageSound()
          }
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev
            return [...prev, msg]
          })
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

    load()
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [offerId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOtherTyping])

  const broadcastTyping = useCallback(() => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: user?.id },
    })
  }, [user?.id])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    const { hasPhone } = maskSensitiveInfo(val)
    setWarning(hasPhone)
    setNewMessage(val)
    broadcastTyping()
  }

  async function sendMessage() {
    if (!newMessage.trim() || !user || isSending) return
    const text = newMessage.trim()
    const { masked } = maskSensitiveInfo(text)
    setNewMessage('')
    setWarning(false)
    setIsSending(true)
    await supabase.from('messages').insert({
      offer_id: offerId,
      sender_id: user.id,
      content: masked,
    })
    setIsSending(false)
    inputRef.current?.focus()
  }

  const otherName = offer
    ? user?.id === offer.request?.buyer_id
      ? offer.merchant?.business_name || 'Commerçant'
      : 'Acheteur'
    : '...'

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Header */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-background/90 backdrop-blur-xl border-b border-border px-4 h-16 flex items-center justify-between sticky top-0 z-40"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="font-semibold text-sm leading-tight">{otherName}</p>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <Lock className="h-2.5 w-2.5" />
              <span>Conversation sécurisée</span>
            </div>
          </div>
        </div>

        <div className="h-8 w-8 rounded-xl flex items-center justify-center font-bold text-sm" style={{background:'linear-gradient(135deg,#8B6914,#C9922A)',color:'#0C0B09'}}>
          T
        </div>
      </motion.nav>

      {/* Offer summary */}
      {offer && (
        <div className="px-4 py-3 bg-accent/50 border-b border-primary/10">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center text-sm" style={{background:'rgba(201,146,42,0.1)'}}>📦</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{offer.request?.title}</p>
              <p className="text-xs text-primary font-medium">Offre acceptée · <span className="font-bold">{offer.price} MAD</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Security notice */}
      <div className="px-4 py-2 max-w-2xl mx-auto w-full mt-3">
        <div className="bg-card border border-border/60 rounded-2xl px-4 py-3 flex items-start gap-2.5">
          <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Tabit protège votre transaction.</strong>{' '}
            Ne partagez jamais votre numéro ou email. Effectuez le paiement uniquement via Tabit.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex gap-2">
              {[0,1,2].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                  className="h-2 w-2 bg-primary rounded-full"
                />
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="text-4xl mb-3">💬</div>
            <p className="text-muted-foreground text-sm">Démarrez la conversation</p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map(msg => {
              const { masked } = maskSensitiveInfo(msg.content)
              const isMe = msg.sender_id === user?.id
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-card border border-border/60 text-foreground rounded-bl-sm'
                    }`}
                  >
                    <p className="leading-relaxed break-words">{masked}</p>
                    {masked !== msg.content && (
                      <p className={`text-xs mt-1 italic ${isMe ? 'text-primary-foreground/60' : 'text-red-400'}`}>
                        ⚠️ Information masquée
                      </p>
                    )}
                    <p className={`text-[10px] mt-1.5 ${isMe ? 'text-primary-foreground/50' : 'text-muted-foreground'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {isOtherTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="bg-background/90 backdrop-blur-xl border-t border-border px-4 py-3 sticky bottom-0"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <AnimatePresence>
          {warning && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl mb-2 text-center max-w-2xl mx-auto"
            >
              ⚠️ Les numéros et emails sont automatiquement masqués
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-2xl mx-auto flex gap-2 items-end">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Votre message..."
            className="flex-1 bg-muted border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center disabled:opacity-40 shadow-md shadow-primary/25 shrink-0 transition-colors"
          >
            <Send className="h-5 w-5 text-primary-foreground" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
