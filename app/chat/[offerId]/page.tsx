'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function maskSensitiveInfo(text: string): { masked: string; hasPhone: boolean } {
  const phoneRegex = /(\+212|0)([ \-]?)([5-7]\d{8}|\d{9})/g
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const whatsappRegex = /whatsapp|watsap|watsapp|واتساب/gi
  let hasPhone = false
  let masked = text
  if (phoneRegex.test(text) || emailRegex.test(text) || whatsappRegex.test(text)) {
    hasPhone = true
    masked = text
      .replace(/(\+212|0)([ \-]?)([5-7]\d{8}|\d{9})/g, '🔒 [Numéro masqué]')
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '🔒 [Email masqué]')
      .replace(/whatsapp|watsap|watsapp|واتساب/gi, '🔒 [Contact masqué]')
  }
  return { masked, hasPhone }
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
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
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
          filter: `offer_id=eq.${offerId}`
        }, payload => {
          setMessages(prev => [...prev, payload.new])
        })
        .subscribe()
      return () => { supabase.removeChannel(channel) }
    }
    load()
  }, [offerId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    const { hasPhone } = maskSensitiveInfo(val)
    setWarning(hasPhone)
    setNewMessage(val)
  }

  async function sendMessage() {
    if (!newMessage.trim() || !user) return
    const { masked } = maskSensitiveInfo(newMessage.trim())
    setNewMessage('')
    setWarning(false)
    await supabase.from('messages').insert({
      offer_id: offerId,
      sender_id: user.id,
      content: masked,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b px-4 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-500 text-xl">←</button>
          <div>
            <p className="font-semibold text-sm">{offer?.merchant?.business_name || 'Chat'}</p>
            <p className="text-xs text-green-500">🔒 Conversation sécurisée</p>
          </div>
        </div>
        <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">T</div>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-2xl mx-auto w-full">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-sm mb-2">
          <p className="font-semibold text-orange-800">📦 {offer?.request?.title}</p>
          <p className="text-orange-600 mt-1">Offre acceptée : <span className="font-bold">{offer?.price} MAD</span></p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-700 mb-4">
          🛡️ <strong>Tabitus protège votre transaction.</strong> Ne partagez jamais votre numéro de téléphone, email ou contact WhatsApp. Toute tentative sera automatiquement bloquée. Effectuez le paiement uniquement via Tabitus.
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Chargement...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-gray-500 text-sm">Démarrez la conversation</p>
          </div>
        ) : (
          messages.map(msg => {
            const { masked } = maskSensitiveInfo(msg.content)
            const isMe = msg.sender_id === user?.id
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'}`}>
                  <p>{masked}</p>
                  {masked !== msg.content && (
                    <p className={`text-xs mt-1 italic ${isMe ? 'text-orange-200' : 'text-red-400'}`}>
                      ⚠️ Information masquée par Tabitus
                    </p>
                  )}
                  <p className={`text-xs mt-1 ${isMe ? 'text-orange-200' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t px-4 py-3 sticky bottom-0">
        {warning && (
          <div className="bg-red-50 text-red-600 text-xs p-2 rounded-xl mb-2 text-center">
            ⚠️ Les numéros de téléphone et emails sont automatiquement masqués
          </div>
        )}
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Votre message..."
            className="flex-1 border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-orange-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center disabled:opacity-50 text-lg"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
