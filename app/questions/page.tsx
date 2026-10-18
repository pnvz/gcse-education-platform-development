import type { Metadata } from 'next'
import { QuestionBank } from '@/components/questions/question-bank'
import { PageIntro } from '@/components/reveal'
import { QUESTIONS } from '@/lib/data'
import { getSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Question bank',
  description: 'Timed and untimed Edexcel iGCSE practice questions with instant marking.',
}

export default async function QuestionsPage() {
  const session = await getSession()
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Question bank"
        title="Test yourself, timed or untimed"
        description="Build a quiz from the topics you choose. Every answer is marked instantly with an explanation, and your results are saved to your account."
      />
      <div className="mt-10">
        <QuestionBank questions={QUESTIONS} signedIn={Boolean(session?.user)} />
      </div>
    </main>
  )
}
