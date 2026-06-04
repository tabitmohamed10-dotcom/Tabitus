'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

function playNotifSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const notes = [
      { freq: 587, start: 0,    dur: 0.14 },
      { freq: 784, start: 0.10, dur: 0.14 },
      { freq: 987, start: 0.20, dur: 0.22 },
    ]
    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = ctx.currentTime + start
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.3, t + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
      osc.start(t)
      osc.stop(t + dur + 0.05)
    })
  } catch { /* noop */ }
}

function showInAppToast(title: string, body: string, url: string) {
  playNotifSound()

  if (typeof window === 'undefined') return

  if ((Notification as any).permission === 'granted') {
    try {
      const n = new Notification(title, { body, icon: '/logo.svg', tag: 'tabit' })
      n.onclick = () => { window.location.href = url }
    } catch { /* noop */ }
  }

  const wrap = document.createElement('div')
  wrap.innerHTML = `<div style="position:fixed;top:80px;right:20px;z-index:9999;background:#0C0B09;border:1px solid #C9922A;border-radius:14px;padding:16px 20px;min-width:300px;max-width:360px;box-shadow:0 8px 32px rgba(0,0,0,0.5);animation:tabToastIn 0.3s ease;cursor:pointer" onclick="window.location.href='${url}';this.parentElement.remove()">
  <div style="display:flex;align-items:flex-start;gap:12px">
    <div style="width:9px;height:9px;background:#C9922A;border-radius:50%;margin-top:3px;animation:tabPulse 1.2s infinite;flex-shrink:0"></div>
    <div style="flex:1">
      <p style="color:#F0E8D4;font-size:13px;font-weight:600;margin:0 0 3px">${title}</p>
      <p style="color:rgba(240,232,212,0.55);font-size:12px;margin:0;line-height:1.4">${body}</p>
    </div>
    <button onclick="event.stopPropagation();this.closest('[style]').remove()" style="background:none;border:none;color:#8A856E;cursor:pointer;font-size:18px;line-height:1;padding:0;margin-left:4px;flex-shrink:0">×</button>
  </div>
</div>`
  document.body.appendChild(wrap)
  setTimeout(() => wrap.remove(), 6500)
}

export default function NotificationSystem({ userId, role }: { userId: string; role: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    Notification.requestPermission().catch(() => {})
  }, [])

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    let cleanup: (() => void) | undefined

    if (role === 'buyer') {
      const channel = supabase.channel(`buyer-notifs-${userId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'offers',
        }, async (payload) => {
          const { data: req } = await supabase
            .from('requests')
            .select('buyer_id, title')
            .eq('id', payload.new.request_id)
            .single()
          if (req?.buyer_id === userId) {
            showInAppToast(
              '🎯 Nouvelle offre reçue !',
              `Un commerçant a répondu à "${req.title}"`,
              `/dashboard/buyer/requests/${payload.new.request_id}`
            )
          }
        })
        .subscribe()
      cleanup = () => supabase.removeChannel(channel)
    }

    if (role === 'merchant') {
      supabase.from('merchants').select('id').eq('user_id', userId).single().then(({ data: merchant }) => {
        if (!merchant) return
        const channel = supabase.channel(`merchant-notifs-${userId}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'offers',
            filter: `merchant_id=eq.${merchant.id}`,
          }, (payload) => {
            if (payload.new.status === 'accepted') {
              showInAppToast(
                '🎉 Offre acceptée !',
                `Votre offre de ${payload.new.price} MAD a été acceptée`,
                `/chat/${payload.new.id}`
              )
            }
          })
          .subscribe()
        cleanup = () => supabase.removeChannel(channel)
      })
    }

    return () => cleanup?.()
  }, [userId, role])

  return null
}
