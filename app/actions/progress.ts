'use server'

import { CARD_BY_ID, PAPERS, QUESTION_BY_ID } from '@/lib/data'
import { db } from '@/lib/db'
import {
  flashcardProgress,
  flashcardReviews,
  paperProgress,
  questionAttempts,
  quizSessions,
} from '@/lib/db/schema'
import { getSession } from '@/lib/session'
import { schedule, type Rating } from '@/lib/srs'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function currentUserId() {
  const session = await getSession()
  return session?.user?.id ?? null
}

export async function reviewCard(
  cardId: string,
  rating: Rating,
): Promise<{ saved: boolean }> {
  const userId = await currentUserId()
  const card = CARD_BY_ID.get(cardId)
  if (!userId || !card || ![1, 2, 3, 4].includes(rating)) return { saved: false }

  const [existing] = await db
    .select()
    .from(flashcardProgress)
    .where(
      and(eq(flashcardProgress.userId, userId), eq(flashcardProgress.cardId, cardId)),
    )
    .limit(1)

  const next = schedule(
    existing ?? { ease: 2.5, intervalDays: 0, reps: 0, lapses: 0 },
    rating,
  )

  await db
    .insert(flashcardProgress)
    .values({
      userId,
      cardId,
      subject: card.subject,
      ease: next.ease,
      intervalDays: next.intervalDays,
      reps: next.reps,
      lapses: next.lapses,
      dueAt: next.dueAt,
      lastReviewedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [flashcardProgress.userId, flashcardProgress.cardId],
      set: {
        ease: next.ease,
        intervalDays: next.intervalDays,
        reps: next.reps,
        lapses: next.lapses,
        dueAt: next.dueAt,
        lastReviewedAt: new Date(),
      },
    })

  await db
    .insert(flashcardReviews)
    .values({ userId, cardId, subject: card.subject, rating })

  return { saved: true }
}

export interface QuizResultInput {
  questionId: string
  correct: boolean
  timeMs: number
}

export async function saveQuizSession(input: {
  subject: string
  topic: string
  mode: 'timed' | 'untimed'
  durationSec: number
  results: QuizResultInput[]
}): Promise<{ saved: boolean }> {
  const userId = await currentUserId()
  if (!userId || input.results.length === 0) return { saved: false }

  const valid = input.results.filter((r) => QUESTION_BY_ID.has(r.questionId))
  if (valid.length === 0) return { saved: false }

  await db.insert(questionAttempts).values(
    valid.map((r) => {
      const q = QUESTION_BY_ID.get(r.questionId)!
      return {
        userId,
        questionId: r.questionId,
        subject: q.subject,
        topic: q.topic,
        correct: r.correct,
        timeMs: Math.max(0, Math.min(Math.round(r.timeMs), 3_600_000)),
        mode: input.mode,
      }
    }),
  )

  await db.insert(quizSessions).values({
    userId,
    subject: input.subject,
    topic: input.topic,
    mode: input.mode,
    total: valid.length,
    correct: valid.filter((r) => r.correct).length,
    durationSec: Math.max(0, Math.min(Math.round(input.durationSec), 86_400)),
  })

  revalidatePath('/dashboard')
  return { saved: true }
}

export async function togglePaperDone(paperKey: string): Promise<{ done: boolean } | null> {
  const userId = await currentUserId()
  if (!userId || !PAPERS.some((p) => p.id === paperKey)) return null

  const where = and(eq(paperProgress.userId, userId), eq(paperProgress.paperKey, paperKey))
  const [existing] = await db.select().from(paperProgress).where(where).limit(1)

  if (existing) {
    await db.delete(paperProgress).where(where)
    revalidatePath('/dashboard')
    return { done: false }
  }
  await db.insert(paperProgress).values({ userId, paperKey })
  revalidatePath('/dashboard')
  return { done: true }
}
