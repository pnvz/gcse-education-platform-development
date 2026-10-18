import { CARDS, PAPERS } from '@/lib/data'
import { SUBJECT_IDS, type Flashcard, type SubjectId } from '@/lib/data/subjects'
import { db } from '@/lib/db'
import {
  flashcardProgress,
  flashcardReviews,
  paperProgress,
  questionAttempts,
  quizSessions,
} from '@/lib/db/schema'
import type { CardState } from '@/lib/srs'
import { and, desc, eq, gte, lte } from 'drizzle-orm'

export interface DeckStats {
  total: number
  due: number
  fresh: number
  learning: number
  mastered: number
}

export interface QueueItem {
  card: Flashcard
  state: CardState
  isNew: boolean
}

const NEW_PER_SESSION = 10
const MASTERED_INTERVAL_DAYS = 21

export async function getDeckStats(userId: string | null): Promise<Record<SubjectId, DeckStats>> {
  const rows = userId
    ? await db.select().from(flashcardProgress).where(eq(flashcardProgress.userId, userId))
    : []
  const now = Date.now()
  const result = {} as Record<SubjectId, DeckStats>
  for (const subject of SUBJECT_IDS) {
    const mine = rows.filter((r) => r.subject === subject)
    const total = CARDS[subject].length
    const due = mine.filter((r) => r.dueAt.getTime() <= now).length
    const mastered = mine.filter((r) => r.intervalDays >= MASTERED_INTERVAL_DAYS).length
    result[subject] = {
      total,
      due,
      fresh: total - mine.length,
      learning: mine.length - mastered,
      mastered,
    }
  }
  return result
}

export async function getStudyQueue(
  userId: string | null,
  subject: SubjectId,
  topic?: string,
): Promise<QueueItem[]> {
  const cards = CARDS[subject].filter((c) => !topic || c.topic === topic)
  const progress = userId
    ? await db
        .select()
        .from(flashcardProgress)
        .where(and(eq(flashcardProgress.userId, userId), eq(flashcardProgress.subject, subject)))
    : []
  const byCard = new Map(progress.map((p) => [p.cardId, p]))
  const now = Date.now()

  const due: QueueItem[] = []
  const fresh: QueueItem[] = []
  for (const card of cards) {
    const p = byCard.get(card.id)
    if (!p) {
      fresh.push({ card, state: { ease: 2.5, intervalDays: 0, reps: 0, lapses: 0 }, isNew: true })
    } else if (p.dueAt.getTime() <= now) {
      due.push({
        card,
        state: { ease: p.ease, intervalDays: p.intervalDays, reps: p.reps, lapses: p.lapses },
        isNew: false,
      })
    }
  }
  due.sort((a, b) => a.state.intervalDays - b.state.intervalDays)
  return [...due, ...fresh.slice(0, NEW_PER_SESSION)]
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export async function getDashboard(userId: string) {
  const since = new Date(Date.now() - 60 * 24 * 3600 * 1000)

  const [progress, reviews, attempts, sessions, papers] = await Promise.all([
    db.select().from(flashcardProgress).where(eq(flashcardProgress.userId, userId)),
    db
      .select({ at: flashcardReviews.reviewedAt })
      .from(flashcardReviews)
      .where(and(eq(flashcardReviews.userId, userId), gte(flashcardReviews.reviewedAt, since))),
    db.select().from(questionAttempts).where(eq(questionAttempts.userId, userId)),
    db
      .select()
      .from(quizSessions)
      .where(eq(quizSessions.userId, userId))
      .orderBy(desc(quizSessions.createdAt))
      .limit(6),
    db.select().from(paperProgress).where(eq(paperProgress.userId, userId)),
  ])

  const now = Date.now()
  const dueByDay = new Map<string, number>()
  for (const r of reviews) dueByDay.set(dayKey(r.at), (dueByDay.get(dayKey(r.at)) ?? 0) + 1)
  const activity = new Map(dueByDay)
  for (const a of attempts) {
    if (a.createdAt >= since) activity.set(dayKey(a.createdAt), (activity.get(dayKey(a.createdAt)) ?? 0) + 1)
  }

  let streak = 0
  const cursor = new Date()
  if (!activity.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  while (activity.has(dayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return { day: dayKey(d), label: d.toLocaleDateString('en-GB', { weekday: 'short' }), count: activity.get(dayKey(d)) ?? 0 }
  })

  const subjectStats = SUBJECT_IDS.map((subject) => {
    const p = progress.filter((x) => x.subject === subject)
    const a = attempts.filter((x) => x.subject === subject)
    const topics = new Map<string, { correct: number; total: number }>()
    for (const x of a) {
      const t = topics.get(x.topic) ?? { correct: 0, total: 0 }
      t.total += 1
      if (x.correct) t.correct += 1
      topics.set(x.topic, t)
    }
    return {
      subject,
      cardsTotal: CARDS[subject].length,
      cardsSeen: p.length,
      cardsMastered: p.filter((x) => x.intervalDays >= MASTERED_INTERVAL_DAYS).length,
      due: p.filter((x) => x.dueAt.getTime() <= now).length,
      attempts: a.length,
      accuracy: a.length ? Math.round((a.filter((x) => x.correct).length / a.length) * 100) : null,
      weakTopics: [...topics.entries()]
        .filter(([, v]) => v.total >= 2)
        .map(([topic, v]) => ({ topic, accuracy: Math.round((v.correct / v.total) * 100), total: v.total }))
        .sort((x, y) => x.accuracy - y.accuracy)
        .slice(0, 3),
      papersDone: papers.filter((pp) => PAPERS.find((x) => x.id === pp.paperKey)?.subject === subject).length,
      papersTotal: PAPERS.filter((x) => x.subject === subject).length,
    }
  })

  const answered = attempts.length
  return {
    streak,
    totalDue: progress.filter((x) => x.dueAt.getTime() <= now).length,
    reviewsToday: activity.get(dayKey(new Date())) ?? 0,
    questionsAnswered: answered,
    accuracy: answered ? Math.round((attempts.filter((x) => x.correct).length / answered) * 100) : null,
    last14,
    subjectStats,
    sessions,
  }
}

export async function getDonePaperKeys(userId: string | null): Promise<string[]> {
  if (!userId) return []
  const rows = await db.select().from(paperProgress).where(eq(paperProgress.userId, userId))
  return rows.map((r) => r.paperKey)
}

export { lte }
