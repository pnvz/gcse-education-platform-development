'use client'

import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { SUBJECT_IDS, SUBJECTS, type SubjectId } from '@/lib/data/subjects'
import type { DeckStats } from '@/lib/queries'

export function DeckGrid({
  stats,
  topicCounts: topicCountsBySubject,
}: {
  stats: Record<SubjectId, DeckStats>
  topicCounts: Record<SubjectId, Record<string, number>>
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {SUBJECT_IDS.map((id, i) => {
        const s = SUBJECTS[id]
        const st = stats[id]
        const pct = (n: number) => `${(n / Math.max(st.total, 1)) * 100}%`
        const topicCounts = topicCountsBySubject[id]

        return (
          <motion.section
            key={id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-3xl border border-border bg-card p-6"
            aria-labelledby={`deck-${id}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 id={`deck-${id}`} className="font-display text-2xl font-semibold" style={{ color: s.colorVar }}>
                  {s.name}
                </h2>
                <p className="text-sm text-muted-foreground">{st.total} cards</p>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-semibold tabular-nums">{st.due + Math.min(st.fresh, 10)}</div>
                <div className="text-xs text-muted-foreground">ready now</div>
              </div>
            </div>

            <div
              className="mt-6 flex h-2.5 overflow-hidden rounded-full bg-secondary"
              role="img"
              aria-label={`${st.mastered} mastered, ${st.learning} learning, ${st.fresh} new`}
            >
              <motion.div initial={{ width: 0 }} animate={{ width: pct(st.mastered) }} transition={{ duration: 1, delay: 0.3 }} className="bg-success" />
              <motion.div initial={{ width: 0 }} animate={{ width: pct(st.learning) }} transition={{ duration: 1, delay: 0.4 }} style={{ background: s.colorVar }} />
            </div>
            <dl className="mt-3 flex gap-5 text-xs text-muted-foreground">
              <div><dt className="inline">Mastered </dt><dd className="inline font-medium text-foreground">{st.mastered}</dd></div>
              <div><dt className="inline">Learning </dt><dd className="inline font-medium text-foreground">{st.learning}</dd></div>
              <div><dt className="inline">New </dt><dd className="inline font-medium text-foreground">{st.fresh}</dd></div>
            </dl>

            {s.comingSoon ? (
              <p className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                Coming soon
              </p>
            ) : (
              <Link
                href={`/flashcards/${id}`}
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl font-medium text-background transition hover:brightness-110"
                style={{ background: s.colorVar }}
              >
                Study {s.name}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}

            <div className="mt-6 flex flex-wrap gap-1.5">
              {s.topics.map((t) =>
                s.comingSoon ? (
                  <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground/60">
                    {t}
                  </span>
                ) : (
                <Link
                  key={t}
                  href={`/flashcards/${id}?topic=${encodeURIComponent(t)}`}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-[color:var(--c)] hover:text-foreground"
                  style={{ '--c': s.colorVar } as React.CSSProperties}
                >
                  {t} <span className="opacity-60">{topicCounts[t] ?? 0}</span>
                </Link>
                ),
              )}
            </div>
          </motion.section>
        )
      })}
    </div>
  )
}
