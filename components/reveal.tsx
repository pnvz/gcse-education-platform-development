'use client'

import { motion } from 'motion/react'

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function PageIntro({
  eyebrow,
  title,
  description,
  accent,
}: {
  eyebrow: string
  title: string
  description: string
  accent?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl"
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: accent ?? 'var(--primary)' }}
      >
        {eyebrow}
      </p>
      <h1 className="mt-3 text-balance font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
      <p className="mt-4 text-pretty text-lg text-muted-foreground">{description}</p>
    </motion.div>
  )
}
