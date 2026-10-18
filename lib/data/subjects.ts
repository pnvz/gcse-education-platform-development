export type SubjectId = 'maths' | 'physics' | 'chemistry'

export interface SubjectMeta {
  id: SubjectId
  name: string
  code: string
  tagline: string
  colorVar: string
  topics: string[]
}

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  maths: {
    id: 'maths',
    name: 'Mathematics',
    code: '4MA1',
    tagline: 'Number, algebra, geometry and data',
    colorVar: 'var(--maths)',
    topics: [
      'Number',
      'Algebra',
      'Graphs',
      'Ratio & Proportion',
      'Geometry',
      'Trigonometry',
      'Statistics & Probability',
    ],
  },
  physics: {
    id: 'physics',
    name: 'Physics',
    code: '4PH1',
    tagline: 'Forces, energy, waves and the universe',
    colorVar: 'var(--physics)',
    topics: [
      'Forces & Motion',
      'Energy',
      'Waves',
      'Electricity',
      'Magnetism',
      'Particles & Matter',
      'Radioactivity',
      'Astrophysics',
    ],
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    code: '4CH1',
    tagline: 'Atoms, reactions, bonding and organic',
    colorVar: 'var(--chemistry)',
    topics: [
      'Atomic Structure & Periodic Table',
      'Bonding & Structure',
      'Chemical Calculations',
      'Reactions & Energetics',
      'Acids, Bases & Salts',
      'Rates & Equilibrium',
      'Organic Chemistry',
      'Inorganic & Analysis',
    ],
  },
}

export const SUBJECT_IDS = Object.keys(SUBJECTS) as SubjectId[]

export function isSubjectId(value: string): value is SubjectId {
  return value in SUBJECTS
}

export interface Question {
  id: string
  subject: SubjectId
  topic: string
  difficulty: 1 | 2 | 3
  marks: number
  type: 'mcq' | 'numeric' | 'short'
  prompt: string
  options?: string[]
  /** mcq: index of the correct option. numeric: the number. short: accepted answers (lowercase). */
  answer: number | string[]
  tolerance?: number
  unit?: string
  explanation: string
}

export interface Flashcard {
  id: string
  subject: SubjectId
  topic: string
  front: string
  back: string
}
