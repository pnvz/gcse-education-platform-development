import Link from 'next/link'
import { Features, SpacedTimeline } from '@/components/landing/features'
import { Hero } from '@/components/landing/hero'
import { SubjectCards } from '@/components/landing/subject-cards'
import { Reveal } from '@/components/reveal'
import { buttonVariants } from '@/components/ui/button'
import { ALL_CARDS, ALL_QUESTIONS, CARDS, PAPERS, QUESTIONS } from '@/lib/data'
import { SUBJECT_IDS, type SubjectId } from '@/lib/data/subjects'

export default function HomePage() {
  const counts = Object.fromEntries(
    SUBJECT_IDS.map((id) => [
      id,
      {
        papers: PAPERS.filter((p) => p.subject === id).length,
        questions: QUESTIONS[id].length,
        cards: CARDS[id].length,
      },
    ]),
  ) as Record<SubjectId, { papers: number; questions: number; cards: number }>

  return (
    <main>
      <Hero stats={{ papers: PAPERS.length, questions: ALL_QUESTIONS.length, cards: ALL_CARDS.length }} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="max-w-xl text-balance font-display text-3xl font-semibold sm:text-4xl">
            Three subjects, one place to revise
          </h2>
        </Reveal>
        <div className="mt-10">
          <SubjectCards counts={counts} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Features />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SpacedTimeline />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-8 text-center sm:px-6">
        <Reveal>
          <h2 className="text-balance font-display text-3xl font-semibold sm:text-5xl">
            Your next exam starts with today&apos;s review
          </h2>
          <div className="mt-8 flex justify-center">
            <Link href="/sign-up" className={buttonVariants({ size: 'lg', className: 'h-12 px-7 text-base' })}>
              Create a free account
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Past paper PDFs are hosted by physicsandmathstutor.com. Edexcel and iGCSE are trademarks of Pearson.
      </footer>
    </main>
  )
}
