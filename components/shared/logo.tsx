import Image from 'next/image'

const heights = { sm: 36, md: 48, lg: 64 } as const

export function Logo({ size = 'md' }: { size?: keyof typeof heights }) {
  const h = heights[size]
  return (
    <Image
      src="/logo.svg"
      alt="Tabit"
      width={h * 3.6}
      height={h}
      priority
    />
  )
}
