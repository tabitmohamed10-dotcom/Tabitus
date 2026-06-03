import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl',
    'text-sm font-semibold tracking-[-0.01em]',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
    'active:scale-[0.97]',
    'select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'shadow-[0_1px_3px_rgba(234,88,12,0.3),0_4px_12px_rgba(234,88,12,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]',
          'hover:bg-primary/92 hover:shadow-[0_2px_8px_rgba(234,88,12,0.35),0_8px_24px_rgba(234,88,12,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]',
          'hover:-translate-y-px',
        ].join(' '),
        gradient: [
          'bg-brand-gradient text-white',
          'shadow-[0_2px_8px_rgba(234,88,12,0.30),0_8px_24px_rgba(234,88,12,0.20),inset_0_1px_0_rgba(255,255,255,0.15)]',
          'hover:shadow-[0_4px_16px_rgba(234,88,12,0.40),0_12px_36px_rgba(234,88,12,0.28),inset_0_1px_0_rgba(255,255,255,0.15)]',
          'hover:-translate-y-0.5 hover:opacity-95',
        ].join(' '),
        premium: [
          'bg-foreground text-background',
          'shadow-[0_1px_3px_rgba(0,0,0,0.20),0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]',
          'hover:bg-foreground/88 hover:shadow-[0_2px_8px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,0,0,0.18)]',
          'hover:-translate-y-px',
        ].join(' '),
        outline: [
          'border border-border/80 bg-background text-foreground',
          'shadow-xs',
          'hover:bg-muted/60 hover:border-border',
          'hover:shadow-premium hover:-translate-y-px',
        ].join(' '),
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary/70',
        ].join(' '),
        ghost: [
          'text-muted-foreground',
          'hover:bg-muted/80 hover:text-foreground',
        ].join(' '),
        destructive: [
          'bg-destructive text-destructive-foreground',
          'shadow-sm hover:bg-destructive/88',
        ].join(' '),
        link: [
          'text-primary underline-offset-4 hover:underline p-0 h-auto',
        ].join(' '),
        soft: [
          'bg-accent text-accent-foreground',
          'hover:bg-accent/80',
        ].join(' '),
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-lg gap-1',
        sm: 'h-9 px-3.5 text-xs rounded-xl',
        default: 'h-11 px-5',
        lg: 'h-12 px-7 text-base rounded-2xl',
        xl: 'h-14 px-9 text-base rounded-2xl',
        '2xl': 'h-16 px-12 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
        'icon-sm': 'h-8 w-8 rounded-lg',
        'icon-lg': 'h-12 w-12 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>{children}</span>
          </>
        ) : children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
