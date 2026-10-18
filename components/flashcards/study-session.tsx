'use client'

import { PartyPopper } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { reviewCard } from '@/app/actions/progress'
import { buttonVariants } from '@/components/ui/button'
import { SUBJECTS, type SubjectId } from '@/lib/data/subjects'
import { previewIntervals, RATING_LABELS, schedule, type Rating } from '@/lib/srs'
import type { QueueItem } from '@/lib/queries'
import { cn } from '@/lib/utils'

const RATING_STYLES: Record<Rating, string> = {
  1: 'border-destructive/50 hover:bg-destructive/15',
  2: 'border-amber-500/50 hover:bg-amber-500/15',
  3: 'border-success/50 hover:bg-success/15',
  4: 'border-primary/50 hover:bg-primary/15',
}

export function StudySession({
  subject,
  initialQueue,
  signedIn,
}: {
  subject: SubjectId
  initialQueue: QueueItem[]
  signedIn: boolean
}) {
  const meta = SUBJECTS[subject]
  const [queue, setQueue] = useState(initialQueue)
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState(0)
  const [tally, setTally] = useState<Record<Rating, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 })
  const total = useRef(initialQueue.length)

  const current = queue[0]
  const previews = useMemo(() => (current ? previewIntervals(current.state) : null), [current])

  const rate = useCallback(
    (rating: Rating) => {
      if (!current) return
      void reviewCard(current.card.id, rating)
      setTally((t) => ({ ...t, [rating]: t[rating] + 1 }))
      setReviewed((n) => n + 1)
      setFlipped(false)
      setQueue((q) => {
        const [head, ...rest] = q
        if (rating === 1) {
          const next = schedule(head.state, 1)
          const reinsertAt = Math.min(rest.length, 3)
          rest.splice(reinsertAt, 0, { card: head.card, state: next, isNew: false })
          total.current += 1
        }
        return rest
      })
    },
    [current],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === ' ' || e.key === 'Enter') {
        if (e.target instanceof HTMLElement && e.target.tagName === 'A') return
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        rate(Number(e.key) as Rating)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped, rate])

  if (!current) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md rounded-3xl border border-border bg-card p-10 text-center"
      >
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.2 }}
          className="mx-auto grid size-16 place-items-center rounded-2xl"
          style={{ background: `color-mix(in oklch, ${meta.colorVar} 20%, transparent)`, color: meta.colorVar }}
        >
          <PartyPopper className="size-8" aria-hidden />
        </motion.div>
        <h2 className="mt-6 font-display text-2xl font-semibold">
          {reviewed === 0 ? 'Nothing due right now' : 'Session complete'}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {reviewed === 0
            ? 'All of your cards are scheduled for later. Come back soon.'
            : `You reviewed ${reviewed} cards. ${tally[3] + tally[4]} felt good or easy.`}
        </p>
        {!signedIn && reviewed > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            This session was not saved.{' '}
            <Link href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>{' '}
            to keep your schedule.
          </p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link href={`/flashcards/${subject}`} className={buttonVariants({ size: 'lg', className: 'h-10 px-5' })} prefetch={false}>
            Study more
          </Link>
          <Link href="/flashcards" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-10 px-5' })}>
            All decks
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {reviewed} / {total.current} reviewed
        </span>
        <span>{current.isNew ? 'New card' : 'Review'}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden>
        <motion.div
          className="h-full rounded-full"
          style={{ background: meta.colorVar }}
          animate={{ width: `${(reviewed / total.current) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.card.id}-${reviewed}`}
          initial={{ opacity: 0, x: 60, rotate: 3 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -60, rotate: -3 }}
          transition={{ duration: 0.28 }}
          className="mt-6 [perspective:1400px]"
        >
          <button
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? 'Show question' : 'Show answer'}
            className="relative block h-80 w-full text-left sm:h-96"
          >
            <motion.div
              className="relative size-full [transform-style:preserve-3d]"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 170, damping: 20 }}
            >
              <div
                className="absolute inset-0 flex flex-col rounded-3xl border bg-card p-8 [backface-visibility:hidden]"
                style={{ borderColor: `color-mix(in oklch, ${meta.colorVar} 45%, transparent)` }}
              >
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: meta.colorVar }}>
                  {current.card.topic}
                </span>
                <p className="m-auto text-balance text-center font-display text-2xl font-medium sm:text-3xl">
                  {current.card.front}
                </p>
                <span className="text-center text-xs text-muted-foreground">Press space to flip</span>
              </div>
              <div
                className="absolute inset-0 flex flex-col rounded-3xl border bg-card p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                style={{
                  borderColor: meta.colorVar,
                  background: `linear-gradient(160deg, color-mix(in oklch, ${meta.colorVar} 14%, var(--card)), var(--card))`,
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Answer</span>
                <p className="m-auto whitespace-pre-line text-balance text-center text-xl leading-relaxed sm:text-2xl">
                  {current.card.back}
                </p>
              </div>
            </motion.div>
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 h-20">
        <AnimatePresence mode="wait">
          {flipped && previews ? (
            <motion.div
              key="rate"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-4 gap-2 sm:gap-3"
            >
              {([1, 2, 3, 4] as Rating[]).map((r) => (
                <button
                  key={r}
                  onClick={() => rate(r)}
                  className={cn('rounded-2xl border bg-card py-3 text-center transition active:scale-95', RATING_STYLES[r])}
                >
                  <span className="block font-semibold">{RATING_LABELS[r]}</span>
                  <span className="block text-xs text-muted-foreground">{previews[r]}</span>
                  <span className="sr-only">Shortcut {r}</span>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-6 text-center text-sm text-muted-foreground"
            >
              Think of the answer, then flip the card.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {!signedIn && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link href="/sign-in" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>{' '}
          to save your spaced-repetition schedule.
        </p>
      )}
    </div>
  )
}
