import { and, desc, eq } from 'drizzle-orm'
import { isSubjectId } from '@/lib/data/subjects'
import { db } from '@/lib/db'
import { examAttempts } from '@/lib/db/schema'
import type { ExamQuestionResult, ExamResult, GradeEstimate, TopicScore } from '@/lib/exam-types'

export async function getExamHistory(userId: string) {
  return db
    .select({
      id: examAttempts.id,
      subject: examAttempts.subject,
      title: examAttempts.title,
      topics: examAttempts.topics,
      totalMarks: examAttempts.totalMarks,
      awardedMarks: examAttempts.awardedMarks,
      percentage: examAttempts.percentage,
      estimatedGrade: examAttempts.estimatedGrade,
      timeTakenSec: examAttempts.timeTakenSec,
      timeLimitSec: examAttempts.timeLimitSec,
      createdAt: examAttempts.createdAt,
    })
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId))
    .orderBy(desc(examAttempts.createdAt))
    .limit(50)
}

export async function getExamAttempt(userId: string, id: number): Promise<ExamResult | null> {
  if (!Number.isInteger(id)) return null
  const [row] = await db
    .select()
    .from(examAttempts)
    .where(and(eq(examAttempts.id, id), eq(examAttempts.userId, userId)))
    .limit(1)
  if (!row || !isSubjectId(row.subject)) return null
  const details = row.details as {
    questions: ExamQuestionResult[]
    topicBreakdown: TopicScore[]
    gradeEstimate: GradeEstimate | null
    gradeNote: string
  }
  return {
    attemptId: row.id,
    subject: row.subject,
    title: row.title,
    topics: row.topics,
    timeLimitSec: row.timeLimitSec,
    timeTakenSec: row.timeTakenSec,
    totalMarks: row.totalMarks,
    awardedMarks: row.awardedMarks,
    percentage: row.percentage,
    gradeEstimate: details.gradeEstimate ?? null,
    gradeNote: details.gradeNote ?? '',
    questions: details.questions,
    topicBreakdown: details.topicBreakdown,
    createdAt: row.createdAt.toISOString(),
  }
}
