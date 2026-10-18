'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import Link from 'next/link'
import { useEffect } from 'react'
import { buttonVariants } from '@/components/ui/button'

function Counter({ to }: { to: number }) {
  const value = useMotionValue(0)
  const rounded = useTransform(value, (v) => Math.round(v).toLocaleString('en-GB'))
  useEffect(() => {
    const controls = animate(value, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 })
    return () => controls.stop()
  }, [to, value])
  return <motion.span>{rounded}</motion.span>
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero({
  stats,
}: {
  stats: { papers: number; questions: number; cards: number }
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -left-24 top-0 size-[34rem] animate-aurora rounded-full bg-maths/30 blur-[110px]" />
        <div className="absolute right-0 top-24 size-[30rem] animate-aurora rounded-full bg-physics/25 blur-[110px] [animation-delay:-6s]" />
        <div className="absolute bottom-0 left-1/3 size-[28rem] animate-aurora rounded-full bg-chemistry/20 blur-[120px] [animation-delay:-12s]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-28">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            Edexcel iGCSE Maths, Physics and Chemistry
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl"
          >
            Revise smarter.
            <br />
            <span className="text-gradient">Remember longer.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            Real past papers with mark schemes, a timed question bank, and spaced-repetition
            flashcards that schedule every review at exactly the right moment. Your progress is
            saved to your account.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/sign-up" className={buttonVariants({ size: 'lg', className: 'h-11 px-5 text-base' })}>
              Start revising free
              <ArrowRight aria-hidden />
            </Link>
            <Link
              href="/flashcards"
              className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 px-5 text-base' })}
            >
              Try flashcards
            </Link>
          </motion.div>

          <motion.dl variants={item} className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {[
              { label: 'Past papers', value: stats.papers },
              { label: 'Questions', value: stats.questions },
              { label: 'Flashcards', value: stats.cards },
            ].map((s) => (
              <div key={s.label}>
                <dd className="font-display text-3xl font-semibold tabular-nums">
                  <Counter to={s.value} />
                </dd>
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <HeroCards />
      </div>
    </section>
  )
}

function HeroCards() {
  return (
    <div className="relative mx-auto h-[26rem] w-full max-w-md" aria-hidden>
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -10 }}
        animate={{ opacity: 1, y: 0, rotate: -7 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 90, damping: 14 }}
        className="absolute left-0 top-10 w-72 animate-float rounded-3xl border border-maths/40 bg-card p-6 shadow-2xl shadow-maths/20"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-maths">Maths</p>
        <p className="mt-4 font-display text-xl font-medium">Quadratic formula</p>
        <p className="mt-5 text-lg text-muted-foreground">x = (−b ± √(b² − 4ac)) ÷ 2a</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50, rotate: 10 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 90, damping: 14 }}
        className="absolute right-0 top-0 w-64 animate-float rounded-3xl border border-physics/40 bg-card p-6 shadow-2xl shadow-physics/20 [animation-delay:-2s]"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-physics">Physics</p>
        <p className="mt-4 font-display text-xl font-medium">v = fλ</p>
        <p className="mt-3 text-sm text-muted-foreground">Wave speed = frequency × wavelength</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 90, damping: 14 }}
        className="glass absolute bottom-0 left-10 right-0 animate-float rounded-3xl p-5 [animation-delay:-4s]"
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>How well did you know it?</span>
          <span className="text-chemistry">Chemistry</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs font-medium">
          {[
            ['Again', '10m'],
            ['Hard', '1d'],
            ['Good', '3d'],
            ['Easy', '8d'],
          ].map(([label, t], i) => (
            <div
              key={label}
              className="rounded-xl bg-secondary py-2.5"
              style={i === 2 ? { background: 'var(--primary)', color: 'var(--primary-foreground)' } : undefined}
            >
              <div>{label}</div>
              <div className="mt-0.5 opacity-70">{t}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
