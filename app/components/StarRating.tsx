'use client'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  count?: number
  size?: number
  showLabel?: boolean
}

export function StarRating({ rating, count, size = 14, showLabel = true }: StarRatingProps) {
  const rounded = Math.round(rating)
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          style={{
            color: i <= rounded ? '#F59E0B' : '#D1D5DB',
            fill: i <= rounded ? '#F59E0B' : 'none',
            flexShrink: 0,
          }}
        />
      ))}
      {showLabel && (
        <span style={{ fontSize: Math.max(size - 2, 10), color: '#8A856E', marginLeft: 3 }}>
          {rating > 0
            ? `${rating.toFixed(1)}${count !== undefined ? ` (${count})` : ''}`
            : 'Nouveau'}
        </span>
      )}
    </div>
  )
}
