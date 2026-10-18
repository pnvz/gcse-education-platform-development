import type { Metadata } from 'next'
import Link from 'next/link'
import { DeckGrid } from '@/components/flashcards/deck-grid'
import { PageIntro } from '@/components/reveal'
import { CARDS } from '@/lib/data'
import { SUBJECT_IDS, type SubjectId } from '@/lib/data/subjects'
import { getDeckStats } from '@/lib/queries'
import { getSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Flashcards',
  description: 'Spaced-repetition flashcards for Edexcel iGCSE Maths, Physics and Chemistry.',
}

export default async function FlashcardsPage() {
  const session = await getSession()
  const stats = await getDeckStats(session?.user?.id ?? null)
  const topicCounts = Object.fromEntries(
    SUBJECT_IDS.map((id) => {
      const counts: Record<string, number> = {}
      for (const c of CARDS[id]) counts[c.topic] = (counts[c.topic] ?? 0) + 1
      return [id, counts]
    }),
  ) as Record<SubjectId, Record<string, number>>

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Flashcards"
        title="Spaced repetition, built in"
        description="Rate how well you remembered each card. Hard cards return within minutes or days; easy cards drift weeks into the future."
      />
      {!session?.user && (
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>{' '}
          to save your schedule across devices.
        </p>
      )}
      <div className="mt-10">
        <DeckGrid stats={stats} topicCounts={topicCounts} />
      </div>
    </main>
  )
}
