import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { people, personById } from './data/people.js'
import { courseById } from './data/courses.js'
import { baseEnrollments, TODAY } from './data/enrollments.js'

const Ctx = createContext(null)
const USER_KEY = 'blms.user.v1'
const PROG_KEY = 'blms.progress.v1'
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }
const iso = (t) => new Date(t).toISOString().slice(0, 10)

export function AppProvider({ children }) {
  const [userId, setUserId] = useState(() => read(USER_KEY, null))
  const [overrides, setOverrides] = useState(() => read(PROG_KEY, {}))
  useEffect(() => write(USER_KEY, userId), [userId])
  useEffect(() => write(PROG_KEY, overrides), [overrides])

  const enrollments = useMemo(() => baseEnrollments.map((e) => {
    const o = overrides[`${e.userId}:${e.courseId}`]
    if (o === undefined) return e
    const n = courseById(e.courseId).modules.length
    const done = Math.min(n, o)
    return { ...e, completedModules: done, lastActivity: iso(TODAY),
      completedAt: done === n ? iso(TODAY) : null, quizScore: done === n ? (e.quizScore ?? 88) : null }
  }), [overrides])

  const advance = useCallback((uid, cid) => {
    const e = enrollments.find((x) => x.userId === uid && x.courseId === cid)
    if (e) setOverrides((o) => ({ ...o, [`${uid}:${cid}`]: e.completedModules + 1 }))
  }, [enrollments])

  const value = {
    user: userId ? personById(userId) : null,
    signIn: setUserId, signOut: () => setUserId(null),
    enrollments, advance,
    resetDemo: () => setOverrides({}),
    people,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useApp = () => useContext(Ctx)

export function statusOf(e) {
  const n = courseById(e.courseId).modules.length
  if (e.completedModules >= n) return 'completed'
  if (new Date(e.dueDate).getTime() < TODAY) return 'overdue'
  return e.completedModules > 0 ? 'in-progress' : 'not-started'
}
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
export const daysUntil = (d) => Math.round((new Date(d).getTime() - TODAY) / 86400000)
