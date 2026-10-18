'use client'

import { Check, ExternalLink, FileText } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { togglePaperDone } from '@/app/actions/progress'
import { SUBJECT_IDS, SUBJECTS, type SubjectId } from '@/lib/data/subjects'
import { cn } from '@/lib/utils'

interface Paper {
  id: string
  subject: SubjectId
  paper: string
  year: number
  series: string
  resit: boolean
  label: string
  qp: string
  ms: string | null
  ma: string | null
}

const groupLabel = (paper: string) => paper.replace('New-Spec-', '').replace(/-/g, ' ')

function PaperLink({ href, children, accent }: { href: string | null; children: string; accent: string }) {
  if (!href) {
    return <span className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground/40">{children}</span>
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-sm font-medium transition hover:border-[color:var(--c)] hover:bg-[color:var(--c)]/10"
      style={{ '--c': accent } as React.CSSProperties}
    >
      {children}
      <ExternalLink className="size-3 opacity-50 transition group-hover/link:opacity-100" aria-hidden />
    </a>
  )
}

export function PapersBrowser({
  papers,
  initialDone,
  signedIn,
  initialSubject,
}: {
  papers: Paper[]
  initialDone: string[]
  signedIn: boolean
  initialSubject: SubjectId
}) {
  const [subject, setSubject] = useState<SubjectId>(initialSubject)
  const [group, setGroup] = useState<string | null>(null)
  const [done, setDone] = useState(() => new Set(initialDone))
  const [, startTransition] = useTransition()
  const accent = SUBJECTS[subject].colorVar

  const groups = useMemo(
    () => [...new Set(papers.filter((p) => p.subject === subject).map((p) => p.paper))].sort(),
    [papers, subject],
  )
  const activeGroup = group && groups.includes(group) ? group : groups[0]

  const byYear = useMemo(() => {
    const rows = papers.filter((p) => p.subject === subject && p.paper === activeGroup)
    const map = new Map<number, Paper[]>()
    for (const p of rows) map.set(p.year, [...(map.get(p.year) ?? []), p])
    return [...map.entries()].sort(([a], [b]) => b - a)
  }, [papers, subject, activeGroup])

  function toggle(id: string) {
    if (!signedIn) return
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    startTransition(async () => {
      const res = await togglePaperDone(id)
      if (!res) {
        setDone((prev) => {
          const next = new Set(prev)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        })
      }
    })
  }

  return (
    <div>
      <div role="tablist" aria-label="Subject" className="flex flex-wrap gap-2">
        {SUBJECT_IDS.map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={subject === id}
            onClick={() => {
              setSubject(id)
              setGroup(null)
            }}
            className="relative rounded-full px-5 py-2 text-sm font-medium transition-colors"
          >
            {subject === id && (
              <motion.span
                layoutId="subject-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: SUBJECTS[id].colorVar }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={cn('relative', subject === id ? 'text-background' : 'text-muted-foreground')}>
              {SUBJECTS[id].name}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            aria-pressed={activeGroup === g}
            className={cn(
              'rounded-lg border px-3.5 py-1.5 text-sm transition',
              activeGroup === g
                ? 'border-transparent font-semibold text-background'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
            style={activeGroup === g ? { background: accent } : undefined}
          >
            {groupLabel(g)}
          </button>
        ))}
      </div>

      {groups.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {SUBJECTS[subject].name} past papers are coming soon.
        </p>
      )}

      {!signedIn && (
        <p className="mt-5 text-sm text-muted-foreground">
          <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>{' '}
          to tick off the papers you have completed.
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${subject}-${activeGroup}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-8 flex flex-col gap-10"
        >
          {byYear.map(([year, rows]) => (
            <section key={year} aria-labelledby={`year-${year}`}>
              <h2 id={`year-${year}`} className="font-display text-2xl font-semibold">
                {year}
              </h2>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {rows.map((p, i) => {
                  const isDone = done.has(p.id)
                  return (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        'flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 transition-colors',
                        isDone ? 'border-[color:var(--c)]/60' : 'border-border',
                      )}
                      style={{ '--c': accent } as React.CSSProperties}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="size-5 text-muted-foreground" aria-hidden />
                        <span className="font-medium">{p.label}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <PaperLink href={p.qp} accent={accent}>
                          Paper
                        </PaperLink>
                        <PaperLink href={p.ms} accent={accent}>
                          Mark scheme
                        </PaperLink>
                        {p.ma && (
                          <PaperLink href={p.ma} accent={accent}>
                            Examiner report
                          </PaperLink>
                        )}
                        {signedIn && (
                          <button
                            onClick={() => toggle(p.id)}
                            aria-pressed={isDone}
                            aria-label={isDone ? `Mark ${p.label} not done` : `Mark ${p.label} done`}
                            className="grid size-8 place-items-center rounded-lg border border-border transition hover:border-[color:var(--c)]"
                            style={isDone ? { background: accent, borderColor: accent } : undefined}
                          >
                            <motion.span
                              initial={false}
                              animate={{ scale: isDone ? 1 : 0, rotate: isDone ? 0 : -45 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            >
                              <Check className="size-4 text-background" aria-hidden />
                            </motion.span>
                          </button>
                        )}
                      </div>
                    </motion.li>
                  )
                })}
              </ul>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
