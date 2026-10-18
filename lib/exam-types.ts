import type { SubjectId } from '@/lib/data/subjects'

export interface ExamQuestion {
  id: string
  topic: string
  marks: number
  type: 'mcq' | 'numeric' | 'short'
  prompt: string
  options?: string[]
  unit?: string
}

export interface ExamQuestionResult {
  questionId: string
  topic: string
  marks: number
  awarded: number
  correct: boolean
  prompt: string
  given: string | null
  correctAnswer: string
  explanation: string
}

export type TopicLevel = 'strength' | 'developing' | 'weakness'

export interface TopicScore {
  topic: string
  awarded: number
  total: number
  percentage: number
  level: TopicLevel
}

export interface GradeEstimate {
  grade: string
  paperLabel: string
  series: string
  sourceUrl: string
}

export interface ExamResult {
  attemptId: number | null
  subject: SubjectId
  title: string
  topics: string[]
  timeLimitSec: number
  timeTakenSec: number
  totalMarks: number
  awardedMarks: number
  percentage: number
  gradeEstimate: GradeEstimate | null
  gradeNote: string
  questions: ExamQuestionResult[]
  topicBreakdown: TopicScore[]
  createdAt?: string
}

export const STRENGTH_THRESHOLD = 70
export const WEAKNESS_THRESHOLD = 50

export function topicLevel(percentage: number): TopicLevel {
  if (percentage >= STRENGTH_THRESHOLD) return 'strength'
  if (percentage < WEAKNESS_THRESHOLD) return 'weakness'
  return 'developing'
}

export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`
}
