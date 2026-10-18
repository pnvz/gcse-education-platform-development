import type { Flashcard, Question, SubjectId } from './subjects'

type Difficulty = 1 | 2 | 3

export function questionFactory(subject: SubjectId, prefix: string) {
  let n = 0
  const nextId = () => `${prefix}-${String(++n).padStart(3, '0')}`

  return {
    mcq(
      topic: string,
      difficulty: Difficulty,
      prompt: string,
      options: string[],
      correct: number,
      explanation: string,
    ): Question {
      return {
        id: nextId(),
        subject,
        topic,
        difficulty,
        marks: 1,
        type: 'mcq',
        prompt,
        options,
        answer: correct,
        explanation,
      }
    },
    num(
      topic: string,
      difficulty: Difficulty,
      prompt: string,
      answer: number,
      explanation: string,
      opts: { tol?: number; unit?: string; marks?: number } = {},
    ): Question {
      return {
        id: nextId(),
        subject,
        topic,
        difficulty,
        marks: opts.marks ?? 2,
        type: 'numeric',
        prompt,
        answer: answer as unknown as number,
        tolerance: opts.tol ?? 0,
        unit: opts.unit,
        explanation,
      }
    },
    short(
      topic: string,
      difficulty: Difficulty,
      prompt: string,
      accepted: string[],
      explanation: string,
    ): Question {
      return {
        id: nextId(),
        subject,
        topic,
        difficulty,
        marks: 1,
        type: 'short',
        prompt,
        answer: accepted.map((a) => a.toLowerCase()),
        explanation,
      }
    },
  }
}

export function cardFactory(subject: SubjectId, prefix: string) {
  let n = 0
  return (topic: string, front: string, back: string): Flashcard => ({
    id: `${prefix}-${String(++n).padStart(3, '0')}`,
    subject,
    topic,
    front,
    back,
  })
}
