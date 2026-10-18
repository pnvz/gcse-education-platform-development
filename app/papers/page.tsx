import type { Metadata } from 'next'
import { PapersBrowser } from '@/components/papers/papers-browser'
import { PageIntro } from '@/components/reveal'
import { PAPERS } from '@/lib/data'
import { isSubjectId } from '@/lib/data/subjects'
import { getDonePaperKeys } from '@/lib/queries'
import { getSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Past papers',
  description: 'Edexcel iGCSE Maths, Physics and Chemistry past papers with mark schemes.',
}

export default async function PapersPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const { subject } = await searchParams
  const session = await getSession()
  const done = await getDonePaperKeys(session?.user?.id ?? null)

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Past papers"
        title="Every Edexcel iGCSE paper, with its mark scheme"
        description="Papers open from the Physics & Maths Tutor archive. Tick off each one as you finish it to track your progress."
      />
      <div className="mt-10">
        <PapersBrowser
          papers={PAPERS}
          initialDone={done}
          signedIn={Boolean(session?.user)}
          initialSubject={subject && isSubjectId(subject) ? subject : 'maths'}
        />
      </div>
    </main>
  )
}
