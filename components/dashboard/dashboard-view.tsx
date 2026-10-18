'use client'

import { Flame, Layers, Target } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { SUBJECTS, type SubjectId } from '@/lib/data/subjects'

interface SubjectStat {
  subject: SubjectId
  cardsTotal: number
  cardsSeen: number
  cardsMastered: number
  due: number
  attempts: number
  accuracy: number | null
  weakTopics: { topic: string; accuracy: number; total: number }[]
  papersDone: number
  papersTotal: number
}

interface DashboardData {
  streak: number
  totalDue: number
  reviewsToday: number
  questionsAnswered: number
  accuracy: number | null
  last14: { day: string; label: string; count: number }[]
  subjectStats: SubjectStat[]
  sessions: { id: number | string; subject: string; topic: string; mode: string; total: number; correct: number; createdAt: Date | string }[]
}

const fade = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
})

function Bar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-secondary">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

export function DashboardView({ name, data }: { name: string; data: DashboardData }) {
  const max = Math.max(1, ...data.last14.map((d) => d.count))

  const tiles = [
    { icon: Flame, label: 'Day streak', value: data.streak, tone: 'text-chemistry' },
    { icon: Layers, label: 'Cards due', value: data.totalDue, tone: 'text-maths' },
    { icon: Target, label: 'Quiz accuracy', value: data.accuracy === null ? '-' : `${data.accuracy}%`, tone: 'text-physics' },
  ]

  return (
    <div>
      <motion.div {...fade(0)} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">{name}</h1>
        </div>
        <Link href="/flashcards" className={buttonVariants({ size: 'lg', className: 'h-11 px-5 text-base' })}>
          {data.totalDue > 0 ? `Review ${data.totalDue} due cards` : 'Study flashcards'}
        </Link>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {tiles.map((t, i) => (
          <motion.div key={t.label} {...fade(i + 1)} className="glass rounded-3xl p-6">
            <t.icon className={`size-5 ${t.tone}`} aria-hidden />
            <div className="mt-4 font-display text-4xl font-semibold tabular-nums">{t.value}</div>
            <div className="text-sm text-muted-foreground">{t.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.section {...fade(4)} className="mt-6 rounded-3xl border border-border bg-card p-6" aria-labelledby="activity-h">
        <h2 id="activity-h" className="font-display text-xl font-semibold">
          Last 14 days
        </h2>
        <div className="mt-6 flex h-32 items-end gap-2">
          {data.last14.map((d, i) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end">
                <motion.div
                  className="w-full rounded-t-md bg-primary"
                  style={{ opacity: d.count ? 1 : 0.15 }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(d.count ? 8 : 4, (d.count / max) * 100)}%` }}
                  transition={{ delay: 0.4 + i * 0.04, type: 'spring', stiffness: 120, damping: 16 }}
                  title={`${d.count} activities`}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {data.subjectStats.map((s, i) => {
          const meta = SUBJECTS[s.subject]
          return (
            <motion.section
              key={s.subject}
              {...fade(5 + i)}
              className="rounded-3xl border border-border bg-card p-6"
              aria-labelledby={`dash-${s.subject}`}
            >
              <h2 id={`dash-${s.subject}`} className="font-display text-xl font-semibold" style={{ color: meta.colorVar }}>
                {meta.name}
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <div className="mb-1.5 flex justify-between">
                    <dt className="text-muted-foreground">Cards mastered</dt>
                    <dd>{s.cardsMastered} / {s.cardsTotal}</dd>
                  </div>
                  <Bar value={(s.cardsMastered / s.cardsTotal) * 100} color={meta.colorVar} delay={0.5} />
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between">
                    <dt className="text-muted-foreground">Papers completed</dt>
                    <dd>{s.papersDone} / {s.papersTotal}</dd>
                  </div>
                  <Bar value={(s.papersDone / s.papersTotal) * 100} color={meta.colorVar} delay={0.6} />
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Question accuracy</dt>
                  <dd>{s.accuracy === null ? 'No attempts yet' : `${s.accuracy}% of ${s.attempts}`}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Cards due</dt>
                  <dd>{s.due}</dd>
                </div>
              </dl>

              {s.weakTopics.length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Focus on</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {s.weakTopics.map((w) => (
                      <li key={w.topic} className="flex justify-between">
                        <span>{w.topic}</span>
                        <span className="text-muted-foreground">{w.accuracy}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <Link href={`/flashcards/${s.subject}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  Cards
                </Link>
                <Link href="/questions" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  Quiz
                </Link>
                <Link href={`/papers?subject=${s.subject}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  Papers
                </Link>
              </div>
            </motion.section>
          )
        })}
      </div>

      <motion.section {...fade(8)} className="mt-6 rounded-3xl border border-border bg-card p-6" aria-labelledby="recent-h">
        <h2 id="recent-h" className="font-display text-xl font-semibold">
          Recent quizzes
        </h2>
        {data.sessions.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No quizzes yet.{' '}
            <Link href="/questions" className="text-primary underline-offset-4 hover:underline">
              Take your first one
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {data.sessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <div className="font-medium">{s.topic}</div>
                  <div className="text-muted-foreground">
                    {s.mode === 'timed' ? 'Timed' : 'Untimed'} ·{' '}
                    {new Date(s.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="font-display text-lg font-semibold tabular-nums">
                  {s.correct}/{s.total}
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>
    </div>
  )
}
