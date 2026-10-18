import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { isSubjectId, SUBJECTS } from '@/lib/data/subjects'
import { formatDuration } from '@/lib/exam-types'
import type { getExamHistory } from '@/lib/exam-queries'

type Attempt = Awaited<ReturnType<typeof getExamHistory>>[number]

export function ExamHistory({ attempts, signedIn }: { attempts: Attempt[]; signedIn: boolean }) {
  return (
    <section aria-labelledby="history-h" className="mt-16">
      <h2 id="history-h" className="font-display text-2xl font-semibold">
        Previous attempts
      </h2>
      {!signedIn ? (
        <p className="mt-3 text-sm text-muted-foreground">
          <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>{' '}
          to save your exam attempts and see your history here.
        </p>
      ) : attempts.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No attempts yet. Your submitted mock exams will appear here.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {attempts.map((a) => {
            const accent = isSubjectId(a.subject) ? SUBJECTS[a.subject].colorVar : undefined
            return (
              <li key={a.id}>
                <Link
                  href={`/exams/${a.id}`}
                  className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-[color:var(--c)]"
                  style={{ '--c': accent } as React.CSSProperties}
                >
                  <div>
                    <p className="font-medium" style={{ color: accent }}>
                      {a.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} ·{' '}
                      {a.topics.length === 0 ? 'All topics' : `${a.topics.length} topic${a.topics.length === 1 ? '' : 's'}`} ·{' '}
                      {formatDuration(a.timeTakenSec)} of {formatDuration(a.timeLimitSec)}
                    </p>
                  </div>
                  <div className="flex items-center gap-5 text-right">
                    <div>
                      <p className="font-display text-xl font-semibold tabular-nums">{a.percentage}%</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {a.awardedMarks}/{a.totalMarks} marks
                      </p>
                    </div>
                    {a.estimatedGrade && (
                      <div>
                        <p className="font-display text-xl font-semibold">{a.estimatedGrade}</p>
                        <p className="text-xs text-muted-foreground">est. grade</p>
                      </div>
                    )}
                    <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" aria-hidden />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
