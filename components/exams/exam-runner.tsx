'use client'

import { ChevronLeft, ChevronRight, Clock, Flag } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { submitExam } from '@/app/actions/exam'
import { Button } from '@/components/ui/button'
import { SUBJECTS, type SubjectId } from '@/lib/data/subjects'
import { formatDuration, type ExamQuestion, type ExamResult } from '@/lib/exam-types'
import { cn } from '@/lib/utils'

export interface ExamSession {
  subject: SubjectId
  topics: string[]
  title: string
  questions: ExamQuestion[]
  timeLimitSec: number
}

export function ExamRunner({
  session,
  onSubmitted,
  onExit,
}: {
  session: ExamSession
  onSubmitted: (result: ExamResult) => void
  onExit: () => void
}) {
  const { questions, timeLimitSec, subject } = session
  const accent = SUBJECTS[subject].colorVar

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [remaining, setRemaining] = useState(timeLimitSec)
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const endAt = useRef(Date.now() + timeLimitSec * 1000)
  const submittingRef = useRef(false)
  const answersRef = useRef(answers)
  answersRef.current = answers

  const question = questions[index]
  const answered = questions.filter((q) => (answers[q.id] ?? '').trim() !== '').length

  const submit = useCallback(async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    setConfirming(false)
    setError(null)
    const left = Math.max(0, (endAt.current - Date.now()) / 1000)
    try {
      const result = await submitExam({
        subject,
        topics: session.topics,
        questionIds: questions.map((q) => q.id),
        answers: answersRef.current,
        timeLimitSec,
        timeTakenSec: Math.round(timeLimitSec - left),
      })
      if (!result) throw new Error('Exam could not be marked')
      onSubmitted(result)
    } catch {
      submittingRef.current = false
      setSubmitting(false)
      setError('Your exam could not be submitted. Your answers are still here, so try again.')
    }
  }, [subject, session.topics, questions, timeLimitSec, onSubmitted])

  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        clearInterval(id)
        void submit()
      }
    }, 250)
    return () => clearInterval(id)
  }, [submit])

  useEffect(() => {
    if (submitting) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [submitting])

  function setAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
  }

  function toggleFlag() {
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(question.id)) next.delete(question.id)
      else next.add(question.id)
      return next
    })
  }

  const urgent = remaining <= 60
  const value = answers[question.id] ?? ''

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div>
          <p className="font-display text-lg font-semibold" style={{ color: accent }}>
            {session.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {answered} of {questions.length} answered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            role="timer"
            aria-label="Time remaining"
            className={cn(
              'inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 font-mono text-sm tabular-nums',
              urgent && 'animate-pulse border-destructive text-destructive',
            )}
          >
            <Clock className="size-4" aria-hidden />
            {formatDuration(remaining)}
          </div>
          <Button onClick={() => setConfirming(true)} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit exam'}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_17rem]">
        <AnimatePresence mode="wait">
          <motion.section
            key={question.id}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.22 }}
            aria-label={`Question ${index + 1} of ${questions.length}`}
            className="rounded-3xl border border-border bg-card p-6 sm:p-8"
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
                    return (
                      <button
                        key={opt}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setAnswer(selected ? '' : String(i))}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                          selected ? 'border-[color:var(--c)] bg-[color:var(--c)]/10' : 'border-border hover:border-muted-foreground/50',
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
                    onChange={(e) => setAnswer(e.target.value)}
                    inputMode={question.type === 'numeric' ? 'decimal' : 'text'}
                    autoComplete="off"
                    maxLength={200}
                    className="h-12 rounded-xl border border-input bg-background/60 px-4 text-base outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
                  />
                </label>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
                <ChevronLeft aria-hidden />
                Previous
              </Button>
              <Button variant="ghost" onClick={toggleFlag} aria-pressed={flagged.has(question.id)}>
                <Flag aria-hidden className={cn(flagged.has(question.id) && 'fill-current text-primary')} />
                {flagged.has(question.id) ? 'Flagged' : 'Flag for review'}
              </Button>
              {index + 1 < questions.length ? (
                <Button onClick={() => setIndex((i) => i + 1)}>
                  Next
                  <ChevronRight aria-hidden />
                </Button>
              ) : (
                <Button onClick={() => setConfirming(true)} disabled={submitting}>
                  Finish
                </Button>
              )}
            </div>
          </motion.section>
        </AnimatePresence>

        <aside aria-label="Question navigator" className="h-fit rounded-3xl border border-border bg-card p-5 lg:sticky lg:top-40">
          <h2 className="text-sm font-semibold">Questions</h2>
          <ol className="mt-3 grid grid-cols-5 gap-2">
            {questions.map((q, i) => {
              const isAnswered = (answers[q.id] ?? '').trim() !== ''
              const isCurrent = i === index
              return (
                <li key={q.id}>
                  <button
                    onClick={() => setIndex(i)}
                    aria-label={`Question ${i + 1}${isAnswered ? ', answered' : ', not answered'}${flagged.has(q.id) ? ', flagged' : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={cn(
                      'relative grid h-9 w-full place-items-center rounded-lg border text-sm font-medium transition',
                      isAnswered ? 'border-transparent text-background' : 'border-border text-muted-foreground hover:text-foreground',
                      isCurrent && 'ring-2 ring-ring ring-offset-2 ring-offset-card',
                    )}
                    style={isAnswered ? { background: accent } : undefined}
                  >
                    {i + 1}
                    {flagged.has(q.id) && (
                      <span className="absolute -right-1 -top-1 size-2.5 rounded-full border border-card bg-destructive" aria-hidden />
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
          <dl className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded" style={{ background: accent }} aria-hidden />
              <dt>Answered</dt>
              <dd className="ml-auto text-foreground">{answered}</dd>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded border border-border" aria-hidden />
              <dt>Not answered</dt>
              <dd className="ml-auto text-foreground">{questions.length - answered}</dd>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-destructive" aria-hidden />
              <dt>Flagged</dt>
              <dd className="ml-auto text-foreground">{flagged.size}</dd>
            </div>
          </dl>
          <button onClick={onExit} className="mt-5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Abandon exam
          </button>
        </aside>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      )}

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl border border-border bg-card p-6"
            >
              <h2 id="confirm-title" className="font-display text-xl font-semibold">
                Submit your exam?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You have answered {answered} of {questions.length} questions
                {flagged.size > 0 ? ` and flagged ${flagged.size} for review` : ''}.
                {answered < questions.length && ' Unanswered questions score zero.'} You cannot change answers after submitting.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setConfirming(false)} autoFocus>
                  Keep working
                </Button>
                <Button onClick={() => void submit()}>Submit exam</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
