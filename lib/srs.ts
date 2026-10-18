export type Rating = 1 | 2 | 3 | 4 // Again, Hard, Good, Easy

export interface CardState {
  ease: number
  intervalDays: number
  reps: number
  lapses: number
}

export const NEW_CARD_STATE: CardState = {
  ease: 2.5,
  intervalDays: 0,
  reps: 0,
  lapses: 0,
}

export const RATING_LABELS: Record<Rating, string> = {
  1: 'Again',
  2: 'Hard',
  3: 'Good',
  4: 'Easy',
}

const MIN_EASE = 1.3
const MS_PER_DAY = 86_400_000
const LEARN_STEP_MS = 10 * 60 * 1000

export interface ScheduleResult extends CardState {
  dueAt: Date
}

/**
 * SM-2 style scheduler. A failed card re-appears in 10 minutes and its interval
 * resets; successful reviews grow the interval by the card's ease factor.
 */
export function schedule(
  state: CardState,
  rating: Rating,
  now: Date = new Date(),
): ScheduleResult {
  let { ease, intervalDays, reps, lapses } = state

  if (rating === 1) {
    lapses += 1
    reps = 0
    ease = Math.max(MIN_EASE, ease - 0.2)
    return {
      ease,
      intervalDays: 0,
      reps,
      lapses,
      dueAt: new Date(now.getTime() + LEARN_STEP_MS),
    }
  }

  reps += 1
  if (reps === 1) {
    intervalDays = rating === 4 ? 4 : rating === 3 ? 1 : 0.5
  } else if (reps === 2) {
    intervalDays = rating === 4 ? 8 : rating === 3 ? 3 : 1.5
  } else {
    const multiplier = rating === 2 ? 1.2 : rating === 3 ? ease : ease * 1.3
    intervalDays = Math.max(1, intervalDays * multiplier)
  }

  if (rating === 2) ease = Math.max(MIN_EASE, ease - 0.15)
  if (rating === 4) ease += 0.15

  return {
    ease,
    intervalDays,
    reps,
    lapses,
    dueAt: new Date(now.getTime() + intervalDays * MS_PER_DAY),
  }
}

export function formatInterval(days: number): string {
  if (days <= 0) return '10m'
  if (days < 1) return `${Math.round(days * 24)}h`
  if (days < 30) return `${Math.round(days)}d`
  if (days < 365) return `${Math.round(days / 30)}mo`
  return `${(days / 365).toFixed(1)}y`
}

/** Preview of the next interval for each rating, shown on the answer buttons. */
export function previewIntervals(state: CardState): Record<Rating, string> {
  const now = new Date()
  return {
    1: formatInterval(schedule(state, 1, now).intervalDays),
    2: formatInterval(schedule(state, 2, now).intervalDays),
    3: formatInterval(schedule(state, 3, now).intervalDays),
    4: formatInterval(schedule(state, 4, now).intervalDays),
  }
}
