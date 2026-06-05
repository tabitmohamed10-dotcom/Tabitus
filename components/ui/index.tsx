import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

// ── BADGE ──────────────────────────────────────────────────────
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors leading-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary dark:bg-primary/20',
        primary: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20',
        outline: 'text-foreground border-border/60',
        success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
        warning: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400',
        info: 'border-transparent bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-300',
        orange: 'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
        urgent: 'border-transparent bg-red-500 text-white animate-pulse shadow-sm',
        purple: 'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
        neutral: 'border-border/60 bg-muted/60 text-muted-foreground',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

// ── CARD ───────────────────────────────────────────────────────
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean
    variant?: 'default' | 'elevated' | 'flat' | 'bordered'
  }
>(({ className, hover, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'border border-border/60 bg-card shadow-premium',
    elevated: 'border border-border/40 bg-card shadow-elevated',
    flat: 'border border-border/60 bg-card',
    bordered: 'border-2 border-border bg-card',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl text-card-foreground',
        variants[variant],
        hover && [
          'transition-all duration-200 cursor-pointer',
          'hover:shadow-elevated hover:-translate-y-0.5',
          'hover:border-border/80',
        ],
        className
      )}
      {...props}
    />
  )
})
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-display text-xl font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground leading-relaxed', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

// ── INPUT ──────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  suffix?: React.ReactNode
  error?: string
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, suffix, error, label, type, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${Math.random().toString(36).substr(2, 9)}` : undefined)

    return (
      <div className="relative w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground/80 leading-none">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-11 w-full rounded-xl border bg-background px-4 py-2.5 text-sm',
              'text-foreground placeholder:text-muted-foreground/60',
              'border-border/70 ring-offset-background',
              'transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 focus-visible:border-primary/50',
              'hover:border-border',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30',
              icon && 'pl-10',
              suffix && 'pr-16',
              error && 'border-destructive/60 focus-visible:ring-destructive/30',
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1 font-medium">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm-.75 3.5a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm.75 6.25a.875.875 0 110-1.75.875.875 0 010 1.75z"/>
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ── TEXTAREA ───────────────────────────────────────────────────
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string; label?: string }
>(({ className, error, label, id, ...props }, ref) => {
  const textareaId = id || (label ? `textarea-${Math.random().toString(36).substr(2, 9)}` : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-foreground/80 leading-none">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'flex min-h-[100px] w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm',
          'text-foreground placeholder:text-muted-foreground/60 resize-none',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 focus-visible:border-primary/50',
          'hover:border-border',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive/60',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  )
})
Textarea.displayName = 'Textarea'

// ── AVATAR ─────────────────────────────────────────────────────
interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  ring?: boolean
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-20 w-20 text-xl',
}

function Avatar({ src, name, size = 'md', className, ring = false }: AvatarProps) {
  const initials = name
    ? name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : '?'

  const ringClass = ring ? 'ring-2 ring-background ring-offset-1' : ''

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover shrink-0', sizeClasses[size], ringClass, className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold shrink-0',
        sizeClasses[size],
        ringClass,
        className
      )}
    >
      {initials}
    </div>
  )
}

// ── LABEL ──────────────────────────────────────────────────────
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-sm font-medium text-foreground/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
    {...props}
  />
))
Label.displayName = 'Label'

// ── SEPARATOR ─────────────────────────────────────────────────
function Separator({ className, orientation = 'horizontal' }: { className?: string; orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      className={cn(
        'bg-border/60',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  )
}

// ── SKELETON ───────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-muted/80 relative overflow-hidden',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:animate-[shimmer_1.8s_infinite]',
        'before:bg-[length:200%_100%]',
        className
      )}
    />
  )
}

// ── STAT CARD ─────────────────────────────────────────────────
interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: { value: number; label: string }
  className?: string
  accentColor?: string
}

function StatCard({ title, value, subtitle, icon, trend, className, accentColor }: StatCardProps) {
  const isPositive = trend ? trend.value >= 0 : true

  return (
    <Card className={cn('p-5 group hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-none mb-3">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-display font-bold leading-none text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-xs text-muted-foreground leading-snug">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'mt-2.5 inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5',
              isPositive
                ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/50'
                : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/50'
            )}>
              {isPositive
                ? <TrendingUp className="h-3 w-3" />
                : <TrendingDown className="h-3 w-3" />
              }
              {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            'p-3 rounded-2xl shrink-0 transition-transform duration-200 group-hover:scale-105',
            accentColor || 'bg-accent text-accent-foreground'
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

// ── PROGRESS ──────────────────────────────────────────────────
interface ProgressProps {
  value: number
  max?: number
  className?: string
  color?: 'brand' | 'green' | 'gold' | 'amber'
}

function Progress({ value, max = 100, className, color = 'brand' }: ProgressProps) {
  const pct = Math.min(100, (value / max) * 100)
  const colors = {
    brand: 'bg-brand-gradient',
    green: 'bg-green-500',
    gold: 'bg-gold-500',
    amber: 'bg-amber-500',
  }

  return (
    <div className={cn('h-2 w-full rounded-full bg-muted/60 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700 ease-out', colors[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ── EMPTY STATE ───────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode | string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {icon && (
        <div className="mb-5">
          {typeof icon === 'string' ? (
            <span className="text-5xl">{icon}</span>
          ) : (
            <div className="p-4 rounded-2xl bg-muted/60 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      )}
      <h3 className="font-display font-bold text-lg text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

// ── DIVIDER WITH TEXT ─────────────────────────────────────────
function DividerText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative flex items-center gap-4', className)}>
      <div className="flex-1 h-px bg-border/60" />
      <span className="text-xs text-muted-foreground font-medium shrink-0">{children}</span>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  )
}

export {
  Badge, badgeVariants,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input, Textarea, Avatar, Label, Separator, Skeleton, StatCard,
  Progress, EmptyState, DividerText,
}
