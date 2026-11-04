import { people } from './people.js'
import { courses } from './courses.js'

// Deterministic pseudo-random so the demo data is stable between loads.
function rng(seed) {
  let s = seed
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296)
}

const DAY = 86400000
const today = new Date(); today.setHours(0, 0, 0, 0)
export const TODAY = today.getTime()
const iso = (offsetDays) => new Date(TODAY + offsetDays * DAY).toISOString().slice(0, 10)

const optional = courses.filter((c) => !c.mandatory)
const mandatory = courses.filter((c) => c.mandatory)

// Each person gets all mandatory courses plus a few optional ones.
export const baseEnrollments = people.flatMap((p, pi) => {
  const r = rng(pi * 97 + 13)
  const pick = [...optional].sort(() => r() - 0.5).slice(0, 2 + Math.floor(r() * 3))
  return [...mandatory, ...pick].map((c) => {
    const n = c.modules.length
    const roll = r()
    let done, dueOffset, completedOffset = null, score = null
    if (roll < 0.42) { done = n; completedOffset = -Math.floor(5 + r() * 160); dueOffset = completedOffset + Math.floor(r() * 25) }
    else if (roll < 0.72) { done = 1 + Math.floor(r() * (n - 1)); dueOffset = Math.floor(3 + r() * 55) }
    else if (roll < 0.86) { done = 0; dueOffset = Math.floor(7 + r() * 70) }
    else { done = Math.floor(r() * (n - 1)); dueOffset = -Math.floor(2 + r() * 30) } // overdue
    if (done === n) score = Math.min(100, Math.round(62 + r() * 38))
    const lastOffset = done === n ? completedOffset : done > 0 ? -Math.floor(r() * 14) : null
    return {
      userId: p.id, courseId: c.id, completedModules: done,
      dueDate: iso(dueOffset),
      completedAt: completedOffset !== null ? iso(completedOffset) : null,
      lastActivity: lastOffset !== null ? iso(lastOffset) : null,
      quizScore: score,
      assignedBy: p.managerId ?? 'u08',
    }
  })
})
