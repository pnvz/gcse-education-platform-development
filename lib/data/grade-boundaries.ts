import type { SubjectId } from './subjects'
import type { GradeEstimate } from '../exam-types'

export interface VerifiedBoundary {
  subject: SubjectId
  /** Matches PastPaper.id for the real paper this mock reproduces in full. */
  paperId: string
  paperLabel: string
  series: string
  totalMarks: number
  /** Minimum raw marks for each grade, highest grade first. */
  grades: { grade: string; minMarks: number }[]
  /** Pearson page the numbers were copied from. */
  sourceUrl: string
}

/**
 * Only add an entry here after copying the numbers from an official Pearson
 * Edexcel grade boundary publication. Do not estimate or interpolate.
 * A mock exam only receives a grade when it reproduces a whole paper listed here.
 */
export const VERIFIED_BOUNDARIES: VerifiedBoundary[] = []

export function estimateGrade(
  subject: SubjectId,
  paperId: string | null,
  awardedMarks: number,
  totalMarks: number,
): GradeEstimate | null {
  if (!paperId) return null
  const entry = VERIFIED_BOUNDARIES.find(
    (b) => b.subject === subject && b.paperId === paperId && b.totalMarks === totalMarks,
  )
  if (!entry) return null
  const hit = entry.grades.find((g) => awardedMarks >= g.minMarks)
  return {
    grade: hit ? hit.grade : 'U',
    paperLabel: entry.paperLabel,
    series: entry.series,
    sourceUrl: entry.sourceUrl,
  }
}
