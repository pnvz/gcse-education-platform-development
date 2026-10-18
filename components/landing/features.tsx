import { BrainCircuit, FileText, Timer } from 'lucide-react'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'

const FEATURES = [
  {
    icon: FileText,
    title: 'Past papers and mark schemes',
    body: 'Every Edexcel iGCSE paper from the PMT archive, grouped by paper and series, with question paper, mark scheme and examiner report links side by side.',
    href: '/papers',
    cta: 'Browse papers',
  },
  {
    icon: Timer,
    title: 'Timed question bank',
    body: 'Pick a topic, choose timed or untimed, and get instant marking with worked explanations. Weak topics surface on your dashboard.',
    href: '/questions',
    cta: 'Start a quiz',
  },
  {
    icon: BrainCircuit,
    title: 'Spaced-repetition flashcards',
    body: 'Rate each card and the scheduler picks the next review: hard cards come back soon, easy ones fade into the future.',
    href: '/flashcards',
    cta: 'Study cards',
  },
]

export function Features() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {FEATURES.map((f, i) => (
        <Reveal key={f.title} delay={i * 0.1}>
          <div className="glass flex h-full flex-col rounded-3xl p-7">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
              <f.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 flex-1 text-pretty text-muted-foreground">{f.body}</p>
            <Link href={f.href} className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline">
              {f.cta}
            </Link>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

const INTERVALS = [
  { day: 'Today', note: 'First look' },
  { day: '1 day', note: 'Good' },
  { day: '3 days', note: 'Good' },
  { day: '8 days', note: 'Easy' },
  { day: '3 weeks', note: 'Good' },
  { day: '2 months', note: 'Mastered' },
]

export function SpacedTimeline() {
  return (
    <Reveal>
      <div className="glass rounded-3xl p-8 sm:p-10">
        <h3 className="font-display text-2xl font-semibold sm:text-3xl">
          Reviews arrive just before you would forget
        </h3>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Each successful recall pushes the next review further away. Forget a card and its interval
          resets. You study less overall and remember more on exam day.
        </p>
        <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {INTERVALS.map((s, i) => (
            <li
              key={s.day}
              className="rounded-2xl border border-border bg-background/40 p-4"
              style={{ opacity: 0.55 + i * 0.09 }}
            >
              <div className="font-display text-lg font-semibold">{s.day}</div>
              <div className="text-sm text-muted-foreground">{s.note}</div>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  )
}
