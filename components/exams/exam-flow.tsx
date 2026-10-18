'use client'

import { Play } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, useTransition } from 'react'
import { startExam } from '@/app/actions/exam'
import { ExamResults } from '@/components/exams/exam-results'
import { ExamRunner, type ExamSession } from '@/components/exams/exam-runner'
import { Button } from '@/components/ui/button'
import { SUBJECT_IDS, SUBJECTS, type SubjectId } from '@/lib/data/subjects'
import type { ExamResult } from '@/lib/exam-types'
import { cn } from '@/lib/utils'

const COUNTS = [10, 20, 30]
const MINUTES = [15, 30, 45, 60, 90]

type Phase = { name: 'setup' } | { name: 'running'; session: ExamSession } | { name: 'results'; result: ExamResult }

export function ExamFlow({
  topicCounts,
  children,
}: {
  topicCounts: Record<SubjectId, Record<string, number>>
  children?: React.ReactNode
}) {
  const [phase, setPhase] = useState<Phase>({ name: 'setup' })
  const [subject, setSubject] = useState<SubjectId>('maths')
  const [topics, setTopics] = useState<string[]>([])
  const [count, setCount] = useState(10)
  const [minutes, setMinutes] = useState(30)
  const [error, setError] = useState<string | null>(null)
  const [starting, startTransition] = useTransition()

  const meta = SUBJECTS[subject]
  const counts = topicCounts[subject]
  const pool = meta.topics.reduce((n, t) => n + (topics.length === 0 || topics.includes(t) ? (counts[t] ?? 0) : 0), 0)
  const actualCount = Math.min(count, pool)

  function start() {
    setError(null)
    startTransition(async () => {
      const res = await startExam({ subject, topics, count })
      if (!res) {
        setError('No questions are available for that selection.')
        return
      }
      setPhase({
        name: 'running',
        session: { subject, topics, title: res.title, questions: res.questions, timeLimitSec: minutes * 60 },
      })
      window.scrollTo({ top: 0 })
    })
  }

  if (phase.name === 'running') {
    return (
      <ExamRunner
        session={phase.session}
        onSubmitted={(result) => {
          setPhase({ name: 'results', result })
          window.scrollTo({ top: 0 })
        }}
        onExit={() => {
          if (window.confirm('Abandon this exam? Your answers will not be saved.')) setPhase({ name: 'setup' })
        }}
      />
    )
  }

  if (phase.name === 'results') {
    return (
      <ExamResults
        result={phase.result}
        actions={
          <Button size="lg" className="h-10 px-5" onClick={() => setPhase({ name: 'setup' })}>
            New mock exam
          </Button>
        }
      />
    )
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-8">
          <section aria-labelledby="exam-subject-h">
            <h2 id="exam-subject-h" className="text-sm font-semibold text-muted-foreground">
              1. Subject
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {SUBJECT_IDS.map((id) => {
                const s = SUBJECTS[id]
                const total = Object.values(topicCounts[id]).reduce((a, b) => a + b, 0)
                return (
                  <button
                    key={id}
                    disabled={s.comingSoon}
                    onClick={() => {
                      setSubject(id)
                      setTopics([])
                    }}
                    aria-pressed={subject === id}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50',
                      subject === id ? 'border-[color:var(--c)] bg-[color:var(--c)]/10' : 'border-border hover:border-muted-foreground/50',
                    )}
                    style={{ '--c': s.colorVar } as React.CSSProperties}
                  >
                    <div className="font-display text-lg font-semibold" style={{ color: subject === id ? s.colorVar : undefined }}>
                      {s.name}
                    </div>
                    <div className="text-sm text-muted-foreground">{s.comingSoon ? 'Coming soon' : `${total} questions`}</div>
                  </button>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="exam-topics-h">
            <div className="flex items-baseline justify-between">
              <h2 id="exam-topics-h" className="text-sm font-semibold text-muted-foreground">
                2. Topics <span className="font-normal">(none selected means all)</span>
              </h2>
              {topics.length > 0 && (
                <button onClick={() => setTopics([])} className="text-sm text-primary underline-offset-4 hover:underline">
                  Clear
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {meta.topics.map((t) => {
                  const on = topics.includes(t)
                  return (
                    <motion.button
                      layout
                      key={`${subject}-${t}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTopics((prev) => (on ? prev.filter((x) => x !== t) : [...prev, t]))}
                      aria-pressed={on}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm transition-colors',
                        on ? 'border-transparent font-semibold text-background' : 'border-border text-muted-foreground hover:text-foreground',
                      )}
                      style={on ? { background: meta.colorVar } : undefined}
                    >
                      {t} <span className="opacity-60">{counts[t] ?? 0}</span>
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </div>
          </section>

          <section aria-labelledby="exam-length-h">
            <h2 id="exam-length-h" className="text-sm font-semibold text-muted-foreground">
              3. Length and time
            </h2>
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              <fieldset>
                <legend className="text-sm text-muted-foreground">Questions</legend>
                <div className="mt-2 flex gap-2">
                  {COUNTS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      aria-pressed={count === n}
                      className={cn(
                        'h-10 flex-1 rounded-lg border text-sm font-medium transition',
                        count === n ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-muted-foreground/50',
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm text-muted-foreground">Time limit (minutes)</legend>
                <div className="mt-2 flex gap-2">
                  {MINUTES.map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinutes(n)}
                      aria-pressed={minutes === n}
                      className={cn(
                        'h-10 flex-1 rounded-lg border text-sm font-medium transition',
                        minutes === n ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-muted-foreground/50',
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Your mock exam</h2>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subject</dt>
              <dd>{meta.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Questions available</dt>
              <dd>{pool}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">In this exam</dt>
              <dd>{actualCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Time limit</dt>
              <dd>{minutes} min</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            No feedback during the exam. Answers are marked when you submit or when time runs out.
          </p>
          <Button size="lg" className="mt-6 h-11 w-full text-base" onClick={start} disabled={pool === 0 || starting}>
            <Play aria-hidden />
            {starting ? 'Preparing...' : 'Start exam'}
          </Button>
          {error && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </aside>
      </div>
      {children}
    </>
  )
}
