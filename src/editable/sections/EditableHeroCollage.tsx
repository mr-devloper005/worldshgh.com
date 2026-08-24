'use client'

import { useEffect, useState } from 'react'

export function EditableHeroCollage({ images }: { images: string[] }) {
  const pool = images.length ? images : ['/placeholder.svg?height=900&width=1400']
  const cellCount = pool.length >= 4 ? 4 : pool.length >= 2 ? 2 : 1
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (pool.length <= 1) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setTick((value) => value + 1), 4200)
    return () => clearInterval(id)
  }, [pool.length])

  const gridClass =
    cellCount === 4
      ? 'grid-cols-2 grid-rows-2'
      : cellCount === 2
      ? 'grid-cols-2 grid-rows-1'
      : 'grid-cols-1 grid-rows-1'

  return (
    <div className={`absolute inset-0 grid ${gridClass}`} aria-hidden="true">
      {Array.from({ length: cellCount }).map((_, cell) => {
        const activeIndex = (cell + tick) % pool.length
        return (
          <div key={cell} className="relative overflow-hidden bg-black">
            {pool.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${i === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                loading={cell === 0 && i === 0 ? 'eager' : 'lazy'}
                {...(cell === 0 && i === 0 ? { fetchPriority: 'high' as const } : {})}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
