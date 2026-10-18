import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StudySession } from '@/components/flashcards/study-session'
import { PageIntro } from '@/components/reveal'
import { isSubjectId, SUBJECTS } from '@/lib/data/subjects'
import { getStudyQueue } from '@/lib/queries'
import { getSession } from '@/lib/session'

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params
  return { title: isSubjectId(subject) ? `${SUBJECTS[subject].name} flashcards` : 'Flashcards' }
}

export default async function StudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string }>
  searchParams: Promise<{ topic?: string }>
}) {
  const { subject } = await params
  const { topic } = await searchParams
  if (!isSubjectId(subject)) notFound()

  const session = await getSession()
  const queue = await getStudyQueue(session?.user?.id ?? null, subject, topic)
  const meta = SUBJECTS[subject]

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/flashcards" className="text-sm text-muted-foreground hover:text-foreground">
        All decks
      </Link>
      <div className="mt-4">
        <PageIntro
          eyebrow={topic ?? 'All topics'}
          accent={meta.colorVar}
          title={`${meta.name} flashcards`}
          description="Flip, recall, then rate honestly. Cards you struggle with come back sooner."
        />
      </div>
      <div className="mt-10">
        <StudySession
          key={`${subject}-${topic ?? 'all'}`}
          subject={subject}
          initialQueue={queue}
          signedIn={Boolean(session?.user)}
        />
      </div>
    </main>
  )
}
