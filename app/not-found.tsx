'use client'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/[0.08] blur-[100px]" />
        <div className="absolute inset-0 bg-dot opacity-30 dark:opacity-10" />
      </div>

      <div className="text-center max-w-md">
        {/* 404 number */}
        <div className="relative mb-8">
          <span className="font-display text-[160px] sm:text-[200px] font-bold leading-none text-gradient opacity-20 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[140px] sm:text-[180px] font-bold leading-none text-gradient select-none">
              404
            </span>
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Page introuvable
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-10 max-w-xs mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-brand-gradient text-white font-semibold rounded-xl shadow-brand hover:opacity-92 hover:-translate-y-px transition-all duration-150 text-sm"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 border border-border/70 bg-card text-foreground font-semibold rounded-xl hover:bg-muted/60 transition-all duration-150 text-sm shadow-premium"
          >
            <ArrowLeft className="h-4 w-4" />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  )
}
