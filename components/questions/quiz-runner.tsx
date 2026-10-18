'use client'

import { Check, Clock, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { saveQuizSession } from '@/app/actions/progress'
import { Button, buttonVariants } from '@/components/ui/button'
import { checkAnswer, displayAnswer } from '@/lib/data'
import { SUBJECTS, type Question } from '@/lib/data/subjects'
import { cn } from '@/lib/utils'

export interface QuizConfig {
  questions: Question[]
  mode: 'timed' | 'untimed'
  secondsPerQuestion: number
  label: string
  subject: string
}

interface Result {
  question: Question
  given: string
  correct: boolean
  timeMs: number
}

function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function QuizRunner({
  config,
  signedIn,
  onExit,
}: {
  config: QuizConfig
  signedIn: boolean
  onExit: () => void
}) {
  const { questions, mode } = config
  const totalSeconds = questions.length * config.secondsPerQuestion

  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<Result[]>([])
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState<boolean | null>(null)
  const [finished, setFinished] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'guest'>('idle')

  const startedAt = useRef(Date.now())
  const questionStartedAt = useRef(Date.now())
  const savedRef = useRef(false)
  const resultsRef = useRef<Result[]>([])
  resultsRef.current = results

  const question = questions[index]

  const finish = useCallback(() => {
    setFinished(true)
  }, [])

  useEffect(() => {
    if (finished) return
    const id = setInterval(() => {
      const secs = (Date.now() - startedAt.current) / 1000
      setElapsed(secs)
      if (mode === 'timed' && secs >= totalSeconds) finish()
    }, 250)
    return () => clearInterval(id)
  }, [finished, mode, totalSeconds, finish])

  useEffect(() => {
    if (!finished || savedRef.current) return
    savedRef.current = true
    if (!signedIn) {
      setSaveState('guest')
      return
    }
    setSaveState('saving')
    saveQuizSession({
      subject: config.subject,
      topic: config.label,
      mode,
      durationSec: (Date.now() - startedAt.current) / 1000,
      results: resultsRef.current.map((r) => ({
        questionId: r.question.id,
        correct: r.correct,
        timeMs: r.timeMs,
      })),
    }).then((res) => setSaveState(res.saved ? 'saved' : 'guest'))
  }, [finished, signedIn, config.subject, config.label, mode])

  function submit() {
    if (checked !== null || value === '') return
    const ok = checkAnswer(question, value)
    setChecked(ok)
    setResults((prev) => [
      ...prev,
      {
        question,
        given: question.type === 'mcq' ? question.options![Number(value)] : value,
        correct: ok,
        timeMs: Date.now() - questionStartedAt.current,
      },
    ])
  }

  function next() {
    if (index + 1 >= questions.length) {
      finish()
      return
    }
    setIndex((i) => i + 1)
    setValue('')
    setChecked(null)
    questionStartedAt.current = Date.now()
  }

  if (finished) {
    return <Summary results={results} total={questions.length} elapsed={elapsed} saveState={saveState} config={config} onExit={onExit} />
  }

  const accent = SUBJECTS[question.subject].colorVar
  const remaining = totalSeconds - elapsed
  const urgent = mode === 'timed' && remaining < 30

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onExit} className="text-sm text-muted-foreground hover:text-foreground">
          Quit
        </button>
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 font-mono text-sm tabular-nums',
            urgent && 'animate-pulse border-destructive text-destructive',
          )}
          role="timer"
          aria-label={mode === 'timed' ? 'Time remaining' : 'Time elapsed'}
        >
          <Clock className="size-4" aria-hidden />
          {mode === 'timed' ? formatClock(remaining) : formatClock(elapsed)}
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden>
        <motion.div
          className="h-full rounded-full"
          style={{ background: accent }}
          animate={{ width: `${((index + (checked !== null ? 1 : 0)) / questions.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.28 }}
          className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold" style={{ color: accent }}>
              {question.topic}
            </span>
            <span>·</span>
            <span>
              Question {index + 1} of {questions.length}
            </span>
            <span>·</span>
            <span>
              {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
            </span>
          </div>

          <p className="mt-5 text-pretty text-lg leading-relaxed">{question.prompt}</p>

          <div className="mt-6">
            {question.type === 'mcq' ? (
              <div role="radiogroup" aria-label="Answer options" className="flex flex-col gap-2.5">
                {question.options!.map((opt, i) => {
                  const selected = value === String(i)
                  const isAnswer = checked !== null && question.answer === i
                  const isWrong = checked === false && selected
                  return (
                    <button
                      key={opt}
                      role="radio"
                      aria-checked={selected}
                      disabled={checked !== null}
                      onClick={() => setValue(String(i))}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                        selected ? 'border-[color:var(--c)] bg-[color:var(--c)]/10' : 'border-border hover:border-muted-foreground/50',
                        isAnswer && 'border-success bg-success/10',
                        isWrong && 'border-destructive bg-destructive/10',
                      )}
                      style={{ '--c': accent } as React.CSSProperties}
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-xs font-semibold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            ) : (
              <label className="flex flex-col gap-2 text-sm font-medium">
                {question.type === 'numeric' ? `Your answer${question.unit ? ` (${question.unit})` : ''}` : 'Your answer'}
                <input
                  value={value}
                  disabled={checked !== null}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) submit()
                  }}
                  inputMode={question.type === 'numeric' ? 'decimal' : 'text'}
                  autoComplete="off"
                  className="h-12 rounded-xl border border-input bg-background/60 px-4 text-base outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:opacity-70"
                />
              </label>
            )}
          </div>

          <AnimatePresence>
            {checked !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
                role="status"
              >
                <div
                  className={cn(
                    'mt-6 rounded-2xl border p-4',
                    checked ? 'border-success/40 bg-success/10' : 'border-destructive/40 bg-destructive/10',
                  )}
                >
                  <p className="flex items-center gap-2 font-semibold">
                    {checked ? <Check className="size-4 text-success" aria-hidden /> : <X className="size-4 text-destructive" aria-hidden />}
                    {checked ? 'Correct' : `Not quite. The answer is ${displayAnswer(question)}`}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{question.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex justify-end">
            {checked === null ? (
              <Button size="lg" className="h-10 px-5" onClick={submit} disabled={value === ''}>
                Check answer
              </Button>
            ) : (
              <Button size="lg" className="h-10 px-5" onClick={next} autoFocus>
                {index + 1 >= questions.length ? 'See results' : 'Next question'}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Summary({
  results,
  total,
  elapsed,
  saveState,
  config,
  onExit,
}: {
  results: Result[]
  total: number
  elapsed: number
  saveState: 'idle' | 'saving' | 'saved' | 'guest'
  config: QuizConfig
  onExit: () => void
}) {
  const correct = results.filter((r) => r.correct).length
  const pct = Math.round((correct / total) * 100)
  const R = 54
  const C = 2 * Math.PI * R

  const byTopic = new Map<string, { c: number; t: number }>()
  for (const r of results) {
    const e = byTopic.get(r.question.topic) ?? { c: 0, t: 0 }
    e.t += 1
    if (r.correct) e.c += 1
    byTopic.set(r.question.topic, e)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-2xl"
    >
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <div className="relative mx-auto size-40">
          <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
            <circle cx="64" cy="64" r={R} fill="none" strokeWidth="10" className="stroke-secondary" />
            <motion.circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - pct / 100) }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <div className="font-display text-4xl font-semibold">{pct}%</div>
              <div className="text-xs text-muted-foreground">
                {correct} / {total}
              </div>
            </div>
          </div>
        </div>
        <h2 className="mt-6 font-display text-2xl font-semibold">
          {pct >= 80 ? 'Excellent work' : pct >= 50 ? 'Solid progress' : 'Keep practising'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {config.label} · {config.mode === 'timed' ? 'Timed' : 'Untimed'} · {formatClock(elapsed)}
          {results.length < total ? ` · ${total - results.length} unanswered` : ''}
        </p>
        <p className="mt-3 text-sm" role="status">
          {saveState === 'saving' && 'Saving your results...'}
          {saveState === 'saved' && (
            <span className="text-success">Saved to your account.</span>
          )}
          {saveState === 'guest' && (
            <span className="text-muted-foreground">
              <Link href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
                Create an account
              </Link>{' '}
              to save your results.
            </span>
          )}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button size="lg" className="h-10 px-5" onClick={onExit}>
            New quiz
          </Button>
          <Link href="/dashboard" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-10 px-5' })}>
            Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[...byTopic.entries()].map(([topic, v]) => (
          <div key={topic} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{topic}</span>
              <span className="text-muted-foreground">
                {v.c}/{v.t}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(v.c / v.t) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-10 font-display text-xl font-semibold">Review</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {results.map((r) => (
          <li key={r.question.id} className="rounded-2xl border border-border bg-card p-4 text-sm">
            <div className="flex items-start gap-3">
              {r.correct ? (
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              ) : (
                <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
              )}
              <div>
                <p>{r.question.prompt}</p>
                {!r.correct && (
                  <p className="mt-1 text-muted-foreground">
                    You said {r.given}. Answer: {displayAnswer(r.question)}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
