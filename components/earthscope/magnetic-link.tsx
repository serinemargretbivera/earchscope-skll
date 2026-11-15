'use client'

import Link from 'next/link'
import type { PointerEvent, ReactNode } from 'react'

function moveTowardPointer(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const bounds = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - bounds.left - bounds.width / 2) * 0.08
  const y = (event.clientY - bounds.top - bounds.height / 2) * 0.08

  event.currentTarget.style.setProperty('--magnetic-x', `${x}px`)
  event.currentTarget.style.setProperty('--magnetic-y', `${y}px`)
}

function resetMagneticOffset(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.setProperty('--magnetic-x', '0px')
  event.currentTarget.style.setProperty('--magnetic-y', '0px')
}

export default function MagneticLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`${className} magnetic-control`}
      onPointerMove={moveTowardPointer}
      onPointerLeave={resetMagneticOffset}
    >
      {children}
    </Link>
  )
}
