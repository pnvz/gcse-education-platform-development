'use client'

import { Play, Timer, Infinity as InfinityIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { QuizRunner, type QuizConfig } from '@/components/questions/quiz-runner'
import { Button } from '@/components/ui/button'
import { SUBJECT_IDS, SUBJECTS, type Question, type SubjectId } from '@/lib/data/subjects'
import { cn } from '@/lib/utils'

const COUNTS = [5, 10, 20]

function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function QuestionBank({
  questions,
  signedIn,
}: {
  questions: Record<SubjectId, Question[]>
  signedIn: boolean
}) {
  const [subject, setSubject] = useState<SubjectId>('maths')
  const [topics, setTopics] = useState<string[]>([])
  const [mode, setMode] = useState<'timed' | 'untimed'>('untimed')
  const [count, setCount] = useState(10)
  const [config, setConfig] = useState<QuizConfig | null>(null)
  const [runId, setRunId] = useState(0)

  const meta = SUBJECTS[subject]
  const pool = useMemo(
    () => questions[subject].filter((q) => topics.length === 0 || topics.includes(q.topic)),
    [questions, subject, topics],
  )
  const actualCount = Math.min(count, pool.length)

  function start() {
    const picked = shuffle(pool).slice(0, actualCount)
    setConfig({
      questions: picked,
      mode,
      secondsPerQuestion: 75,
      subject,
      label: topics.length === 0 ? `${meta.name}: all topics` : topics.length === 1 ? topics[0] : `${meta.name}: ${topics.length} topics`,
    })
    setRunId((n) => n + 1)
  }

  if (config) {
    return <QuizRunner key={runId} config={config} signedIn={signedIn} onExit={() => setConfig(null)} />
  }

  const topicCounts = new Map<string, number>()
  for (const q of questions[subject]) topicCounts.set(q.topic, (topicCounts.get(q.topic) ?? 0) + 1)

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-8">
        <section aria-labelledby="subject-h">
          <h2 id="subject-h" className="text-sm font-semibold text-muted-foreground">
            1. Subject
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {SUBJECT_IDS.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSubject(id)
                  setTopics([])
                }}
                aria-pressed={subject === id}
                className={cn(
                  'rounded-2xl border p-4 text-left transition-all',
                  subject === id ? 'border-[color:var(--c)] bg-[color:var(--c)]/10' : 'border-border hover:border-muted-foreground/50',
                )}
                style={{ '--c': SUBJECTS[id].colorVar } as React.CSSProperties}
              >
                <div className="font-display text-lg font-semibold" style={{ color: subject === id ? SUBJECTS[id].colorVar : undefined }}>
                  {SUBJECTS[id].name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {SUBJECTS[id].comingSoon ? 'Coming soon' : `${questions[id].length} questions`}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="topics-h">
          <div className="flex items-baseline justify-between">
            <h2 id="topics-h" className="text-sm font-semibold text-muted-foreground">
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
                    {t} <span className="opacity-60">{topicCounts.get(t) ?? 0}</span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </section>

        <section aria-labelledby="mode-h">
          <h2 id="mode-h" className="text-sm font-semibold text-muted-foreground">
            3. Mode
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(
              [
                { id: 'untimed', icon: InfinityIcon, title: 'Untimed', body: 'Learn at your own pace with a stopwatch.' },
                { id: 'timed', icon: Timer, title: 'Timed', body: 'About 75 seconds per question. Exam pressure.' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={cn(
                  'flex items-start gap-3 rounded-2xl border p-4 text-left transition-all',
                  mode === m.id ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/50',
                )}
              >
                <m.icon className="mt-0.5 size-5 text-primary" aria-hidden />
                <span>
                  <span className="block font-semibold">{m.title}</span>
                  <span className="text-sm text-muted-foreground">{m.body}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-semibold">Your quiz</h2>
        <fieldset className="mt-5">
          <legend className="text-sm text-muted-foreground">Number of questions</legend>
          <div className="mt-2 flex gap-2">
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                aria-pressed={count === n}
                className={cn(
                  'h-9 flex-1 rounded-lg border text-sm font-medium transition',
                  count === n ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-muted-foreground/50',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </fieldset>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Available</dt>
            <dd>{pool.length}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">In this quiz</dt>
            <dd>{actualCount}</dd>
          </div>
          {mode === 'timed' && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Time limit</dt>
              <dd>{Math.ceil((actualCount * 75) / 60)} min</dd>
            </div>
          )}
        </dl>
        <Button size="lg" className="mt-6 h-11 w-full text-base" onClick={start} disabled={pool.length === 0}>
          <Play aria-hidden />
          Start quiz
        </Button>
        {!signedIn && (
          <p className="mt-3 text-xs text-muted-foreground">Sign in to save your scores and track weak topics.</p>
        )}
      </aside>
    </div>
  )
}
