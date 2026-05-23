'use client'
import { useState, useEffect, useRef } from 'react'
import { Send, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/index'
import { Button } from '@/components/ui/button'
import { cn, formatTimeAgo } from '@/lib/utils'
import type { Message, Profile } from '@/lib/types'

interface ChatProps {
  offerId: string
  currentUser: Profile
  merchantName: string
  onClose?: () => void
}

export function OfferChat({ offerId, currentUser, merchantName, onClose }: ChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles(full_name, avatar_url, role)')
        .eq('offer_id', offerId)
        .order('created_at', { ascending: true })
      setMessages(data || [])
    }
    loadMessages()

    // Mark as read
    supabase
      .from('messages')
      .update({ read: true })
      .eq('offer_id', offerId)
      .neq('sender_id', currentUser.id)

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${offerId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `offer_id=eq.${offerId}`,
      }, async (payload) => {
        // Fetch full message with sender
        const { data: msg } = await supabase
          .from('messages')
          .select('*, sender:profiles(full_name, avatar_url, role)')
          .eq('id', payload.new.id)
          .single()
        if (msg) setMessages(prev => [...prev, msg])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [offerId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim()) return
    setSending(true)
    await supabase.from('messages').insert({
      offer_id: offerId,
      sender_id: currentUser.id,
      content: input.trim(),
    })
    setInput('')
    setSending(false)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl border shadow-premium-hover overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div>
          <h3 className="font-semibold text-sm">Discussion</h3>
          <p className="text-xs text-muted-foreground">{merchantName}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <p>💬 Commencez la discussion</p>
            <p className="text-xs mt-1">Posez vos questions sur l'offre</p>
          </div>
        )}
        {messages.map(msg => {
          const isMine = msg.sender_id === currentUser.id
          return (
            <div
              key={msg.id}
              className={cn('flex gap-2.5', isMine ? 'flex-row-reverse' : 'flex-row')}
            >
              <Avatar
                name={(msg.sender as any)?.full_name}
                src={(msg.sender as any)?.avatar_url}
                size="xs"
                className="shrink-0 mt-1"
              />
              <div className={cn('max-w-[75%]', isMine ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
                <div
                  className={cn(
                    'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                    isMine
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm'
                  )}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {formatTimeAgo(msg.created_at)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2.5">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Votre message..."
            rows={1}
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <Button
            onClick={sendMessage}
            loading={sending}
            disabled={!input.trim()}
            size="icon"
            variant="gradient"
            className="shrink-0 h-11 w-11 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Entrée pour envoyer · Shift+Entrée pour saut de ligne
        </p>
      </div>
    </div>
  )
}
