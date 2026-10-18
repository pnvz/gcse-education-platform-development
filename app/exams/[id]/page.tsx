import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExamBackLink, ExamResults } from '@/components/exams/exam-results'
import { getExamAttempt } from '@/lib/exam-queries'
import { requireSession } from '@/lib/session'

export const metadata: Metadata = { title: 'Exam attempt' }

export default async function AttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireSession()
  const result = await getExamAttempt(session.user.id, Number(id))
  if (!result) notFound()

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/exams" className="text-sm text-muted-foreground hover:text-foreground">
        Mock exams
      </Link>
      <p className="mt-4 text-sm text-muted-foreground">
        Attempted{' '}
        {new Date(result.createdAt!).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}
      </p>
      <div className="mt-6">
        <ExamResults result={result} actions={<ExamBackLink />} />
      </div>
    </main>
  )
}
