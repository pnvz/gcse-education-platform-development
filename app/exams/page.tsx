import type { Metadata } from 'next'
import { ExamFlow } from '@/components/exams/exam-flow'
import { ExamHistory } from '@/components/exams/exam-history'
import { PageIntro } from '@/components/reveal'
import { QUESTIONS } from '@/lib/data'
import { SUBJECT_IDS, type SubjectId } from '@/lib/data/subjects'
import { getExamHistory } from '@/lib/exam-queries'
import { getSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Mock exams',
  description: 'Timed Edexcel iGCSE mock exams with automatic marking, topic strengths and weaknesses, and saved history.',
}

export default async function ExamsPage() {
  const session = await getSession()
  const userId = session?.user?.id
  const attempts = userId ? await getExamHistory(userId) : []

  const topicCounts = {} as Record<SubjectId, Record<string, number>>
  for (const id of SUBJECT_IDS) {
    const counts: Record<string, number> = {}
    for (const q of QUESTIONS[id]) counts[q.topic] = (counts[q.topic] ?? 0) + 1
    topicCounts[id] = counts
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Mock exams"
        title="Sit a timed mock exam"
        description="Choose a subject and topics, set a time limit and work through the questions with no feedback. You get a score, topic strengths and weaknesses, and every attempt is saved to your account."
      />
      <div className="mt-10">
        <ExamFlow topicCounts={topicCounts}>
          <ExamHistory attempts={attempts} signedIn={Boolean(userId)} />
        </ExamFlow>
      </div>
    </main>
  )
}
