'use client'

import { Check, Info, X } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { SUBJECTS } from '@/lib/data/subjects'
import { formatDuration, STRENGTH_THRESHOLD, WEAKNESS_THRESHOLD, type ExamResult } from '@/lib/exam-types'
import { cn } from '@/lib/utils'

const R = 54
const C = 2 * Math.PI * R

export function ExamResults({
  result,
  actions,
}: {
  result: ExamResult
  actions?: React.ReactNode
}) {
  const [filter, setFilter] = useState<'all' | 'incorrect'>('all')
  const accent = SUBJECTS[result.subject].colorVar
  const strengths = result.topicBreakdown.filter((t) => t.level === 'strength')
  const weaknesses = result.topicBreakdown.filter((t) => t.level === 'weakness')
  const shown = result.questions.filter((q) => filter === 'all' || !q.correct)
  const unanswered = result.questions.filter((q) => q.given === null).length

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="relative size-40 shrink-0">
            <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
              <circle cx="64" cy="64" r={R} fill="none" strokeWidth="10" className="stroke-secondary" />
              <motion.circle
                cx="64"
                cy="64"
                r={R}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                stroke={accent}
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: C * (1 - result.percentage / 100) }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-display text-4xl font-semibold">{result.percentage}%</div>
                <div className="text-xs text-muted-foreground">percentage</div>
              </div>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="font-display text-2xl font-semibold">{result.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.topics.length === 0 ? 'All topics' : result.topics.join(', ')}
            </p>
            <dl className="mt-5 grid grid-cols-3 gap-6 text-sm">
              <div>
                <dd className="font-display text-2xl font-semibold tabular-nums">
                  {result.awardedMarks}
                  <span className="text-muted-foreground"> / {result.totalMarks}</span>
                </dd>
                <dt className="text-muted-foreground">raw score</dt>
              </div>
              <div>
                <dd className="font-display text-2xl font-semibold tabular-nums">
                  {result.questions.filter((q) => q.correct).length}
                  <span className="text-muted-foreground"> / {result.questions.length}</span>
                </dd>
                <dt className="text-muted-foreground">correct</dt>
              </div>
              <div>
                <dd className="font-display text-2xl font-semibold tabular-nums">{formatDuration(result.timeTakenSec)}</dd>
                <dt className="text-muted-foreground">of {formatDuration(result.timeLimitSec)}</dt>
              </div>
            </dl>
            {unanswered > 0 && <p className="mt-3 text-xs text-muted-foreground">{unanswered} unanswered, marked as zero.</p>}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background/50 p-4 text-sm" role="note">
          {result.gradeEstimate ? (
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <p>
                <span className="font-semibold">Estimated grade: {result.gradeEstimate.grade}</span>{' '}
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">Estimate only</span>
                <span className="mt-1 block text-muted-foreground">
                  Based on the official Edexcel boundaries for {result.gradeEstimate.paperLabel} ({result.gradeEstimate.series}).{' '}
                  <a
                    href={result.gradeEstimate.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    View source
                  </a>
                </span>
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <p className="text-muted-foreground">{result.gradeNote}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm" role="status">
            {result.attemptId ? (
              <span className="text-success">Saved to your account.</span>
            ) : (
              <span className="text-muted-foreground">
                <Link href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
                  Create an account
                </Link>{' '}
                to save this attempt.
              </span>
            )}
          </p>
          <div className="flex gap-3">{actions}</div>
        </div>
      </div>

      <section aria-labelledby="topics-h" className="mt-8">
        <h2 id="topics-h" className="font-display text-xl font-semibold">
          Topic performance
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Strength is {STRENGTH_THRESHOLD}% or more of the marks. Weakness is under {WEAKNESS_THRESHOLD}%.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-success">Strengths</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {strengths.length ? strengths.map((t) => t.topic).join(', ') : 'None yet in this exam.'}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-destructive">Weaknesses to revise</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {weaknesses.length ? weaknesses.map((t) => t.topic).join(', ') : 'None, nice work.'}
            </p>
          </div>
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {result.topicBreakdown.map((t, i) => (
            <li key={t.topic} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{t.topic}</span>
                <span className="text-muted-foreground tabular-nums">
                  {t.awarded}/{t.total} marks · {t.percentage}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className={cn('h-full rounded-full', t.level === 'weakness' && 'bg-destructive', t.level === 'strength' && 'bg-success')}
                  style={t.level === 'developing' ? { background: accent } : undefined}
                  initial={{ width: 0 }}
                  animate={{ width: `${t.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {t.level === 'strength' ? 'Strength' : t.level === 'weakness' ? 'Weakness' : 'Developing'}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="review-h" className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 id="review-h" className="font-display text-xl font-semibold">
            Review
          </h2>
          <div className="flex gap-1 rounded-full border border-border p-1 text-sm">
            {(['all', 'incorrect'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn('rounded-full px-3 py-1 transition', filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
              >
                {f === 'all' ? 'All' : 'Incorrect'}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {shown.map((q) => (
            <li key={q.questionId} className="rounded-2xl border border-border bg-card p-4 text-sm">
              <div className="flex items-start gap-3">
                {q.correct ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-label="Correct" />
                ) : (
                  <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-label="Incorrect" />
                )}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {q.topic} · {q.awarded}/{q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                  </p>
                  <p className="mt-1">{q.prompt}</p>
                  <p className="mt-2 text-muted-foreground">
                    Your answer: {q.given ?? 'No answer'}
                    {!q.correct && <> · Correct answer: <span className="text-foreground">{q.correctAnswer}</span></>}
                  </p>
                  <p className="mt-1 text-muted-foreground">{q.explanation}</p>
                </div>
              </div>
            </li>
          ))}
          {shown.length === 0 && <li className="text-sm text-muted-foreground">Every question was correct.</li>}
        </ul>
      </section>
    </motion.div>
  )
}

export function ExamBackLink() {
  return (
    <Link href="/exams" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-10 px-5' })}>
      All attempts
    </Link>
  )
}
