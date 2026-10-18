'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/papers', label: 'Past papers' },
  { href: '/questions', label: 'Question bank' },
  { href: '/exams', label: 'Mock exams' },
  { href: '/flashcards', label: 'Flashcards' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main" className="flex items-center gap-0.5 overflow-x-auto">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className="relative whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
