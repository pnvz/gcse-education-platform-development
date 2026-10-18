'use server'

import { revalidatePath } from 'next/cache'
import { QUESTIONS, QUESTION_BY_ID, checkAnswer, displayAnswer } from '@/lib/data'
import { estimateGrade } from '@/lib/data/grade-boundaries'
import { isSubjectId, SUBJECTS, type Question, type SubjectId } from '@/lib/data/subjects'
import { db } from '@/lib/db'
import { examAttempts } from '@/lib/db/schema'
import {
  topicLevel,
  type ExamQuestion,
  type ExamQuestionResult,
  type ExamResult,
  type TopicScore,
} from '@/lib/exam-types'
import { getSession } from '@/lib/session'

const MAX_QUESTIONS = 40
const MAX_TIME_SEC = 4 * 3600
const GRACE_SEC = 30

const NO_GRADE_NOTE =
  'No grade estimate is shown. Edexcel grade boundaries are set for full exam papers, and this mock is built from practice questions rather than a complete paper, so converting the score to a grade would be a guess.'

function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function toExamQuestion(q: Question): ExamQuestion {
  return {
    id: q.id,
    topic: q.topic,
    marks: q.marks,
    type: q.type,
    prompt: q.prompt,
    options: q.options,
    unit: q.unit,
  }
}

export async function startExam(input: {
  subject: string
  topics: string[]
  count: number
}): Promise<{ questions: ExamQuestion[]; title: string } | null> {
  if (!isSubjectId(input.subject)) return null
  const subject = input.subject
  const wanted = new Set(Array.isArray(input.topics) ? input.topics.slice(0, 50) : [])
  const pool = QUESTIONS[subject].filter((q) => wanted.size === 0 || wanted.has(q.topic))
  if (pool.length === 0) return null
  const count = Math.max(1, Math.min(Math.floor(Number(input.count)) || 10, MAX_QUESTIONS, pool.length))
  // Answers and explanations never leave the server until the exam is submitted.
  return {
    questions: shuffle(pool).slice(0, count).map(toExamQuestion),
    title: `${SUBJECTS[subject].name} mock exam`,
  }
}

export async function submitExam(input: {
  subject: string
  topics: string[]
  questionIds: string[]
  answers: Record<string, string>
  timeLimitSec: number
  timeTakenSec: number
}): Promise<ExamResult | null> {
  if (!isSubjectId(input.subject)) return null
  const subject: SubjectId = input.subject

  const ids = [...new Set(Array.isArray(input.questionIds) ? input.questionIds : [])].slice(0, MAX_QUESTIONS)
  const questions = ids
    .map((id) => QUESTION_BY_ID.get(id))
    .filter((q): q is Question => Boolean(q) && q!.subject === subject)
  if (questions.length === 0) return null

  const timeLimitSec = Math.max(60, Math.min(Math.floor(Number(input.timeLimitSec)) || 0, MAX_TIME_SEC))
  const timeTakenSec = Math.max(0, Math.min(Math.floor(Number(input.timeTakenSec)) || 0, timeLimitSec + GRACE_SEC))
  const answers = input.answers && typeof input.answers === 'object' ? input.answers : {}

  const results: ExamQuestionResult[] = questions.map((q) => {
    const raw = answers[q.id]
    const given = typeof raw === 'string' && raw.trim() !== '' ? raw.trim().slice(0, 200) : null
    const correct = given !== null && checkAnswer(q, given)
    return {
      questionId: q.id,
      topic: q.topic,
      marks: q.marks,
      awarded: correct ? q.marks : 0,
      correct,
      prompt: q.prompt,
      given: given === null ? null : q.type === 'mcq' ? (q.options?.[Number(given)] ?? null) : given,
      correctAnswer: displayAnswer(q),
      explanation: q.explanation,
    }
  })

  const totalMarks = results.reduce((n, r) => n + r.marks, 0)
  const awardedMarks = results.reduce((n, r) => n + r.awarded, 0)
  const percentage = totalMarks ? Math.round((awardedMarks / totalMarks) * 100) : 0

  const byTopic = new Map<string, { awarded: number; total: number }>()
  for (const r of results) {
    const t = byTopic.get(r.topic) ?? { awarded: 0, total: 0 }
    t.awarded += r.awarded
    t.total += r.marks
    byTopic.set(r.topic, t)
  }
  const topicBreakdown: TopicScore[] = [...byTopic.entries()]
    .map(([topic, t]) => {
      const pct = Math.round((t.awarded / t.total) * 100)
      return { topic, awarded: t.awarded, total: t.total, percentage: pct, level: topicLevel(pct) }
    })
    .sort((a, b) => a.percentage - b.percentage)

  // Mocks are assembled from the question bank, so there is no real paper to match boundaries against.
  const gradeEstimate = estimateGrade(subject, null, awardedMarks, totalMarks)
  const title = `${SUBJECTS[subject].name} mock exam`
  const topics = (Array.isArray(input.topics) ? input.topics : [])
    .filter((t): t is string => typeof t === 'string' && SUBJECTS[subject].topics.includes(t))

  const result: ExamResult = {
    attemptId: null,
    subject,
    title,
    topics,
    timeLimitSec,
    timeTakenSec,
    totalMarks,
    awardedMarks,
    percentage,
    gradeEstimate,
    gradeNote: gradeEstimate ? '' : NO_GRADE_NOTE,
    questions: results,
    topicBreakdown,
  }

  const session = await getSession()
  if (!session?.user) return result

  const [row] = await db
    .insert(examAttempts)
    .values({
      userId: session.user.id,
      subject,
      title,
      topics,
      timeLimitSec,
      timeTakenSec,
      totalMarks,
      awardedMarks,
      percentage,
      estimatedGrade: gradeEstimate?.grade ?? null,
      details: { questions: results, topicBreakdown, gradeEstimate, gradeNote: result.gradeNote },
    })
    .returning({ id: examAttempts.id })

  revalidatePath('/exams')
  return { ...result, attemptId: row.id }
}
