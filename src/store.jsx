import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { people, personById } from './data/people.js'
import { courseById } from './data/courses.js'
import { baseEnrollments, TODAY } from './data/enrollments.js'

const Ctx = createContext(null)
export const PASS_PCT = 80
const USER_KEY = 'blms.user.v1'
const PROG_KEY = 'blms.progress.v1'
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }
const iso = (t) => new Date(t).toISOString().slice(0, 10)

export function AppProvider({ children }) {
  const [userId, setUserId] = useState(() => read(USER_KEY, null))
  const [overrides, setOverrides] = useState(() => read(PROG_KEY, {}))
  useEffect(() => write(USER_KEY, userId), [userId])
  const [scores, setScores] = useState(() => read('blms.scores.v1', {}))
  const [favs, setFavs] = useState(() => read('blms.favs.v1', {}))
  const [enrolled, setEnrolled] = useState(() => read('blms.enrol.v1', []))
  const [vprog, setVprog] = useState(() => read('blms.video.v1', {}))
  const [votes, setVotes] = useState(() => read('blms.votes.v1', {}))
  useEffect(() => write('blms.video.v1', vprog), [vprog])
  useEffect(() => write('blms.votes.v1', votes), [votes])
  useEffect(() => write(PROG_KEY, overrides), [overrides])
  useEffect(() => write('blms.scores.v1', scores), [scores])
  useEffect(() => write('blms.favs.v1', favs), [favs])
  useEffect(() => write('blms.enrol.v1', enrolled), [enrolled])

  const enrollments = useMemo(() => {
    const extra = enrolled.map((k) => {
      const [u, c] = k.split(':')
      return { userId: u, courseId: c, completedModules: 0, dueDate: iso(TODAY + 30 * 86400000), completedAt: null, lastActivity: null, quizScore: null, assignedBy: u }
    })
    return [...baseEnrollments, ...extra].map((e) => {
      const o = overrides[`${e.userId}:${e.courseId}`]
      if (o === undefined) return e
      const n = courseById(e.courseId).modules.length
      const done = Math.min(n, o)
      const mine = Array.from({ length: n }, (_, i) => scores[`${e.userId}:${e.courseId}:${i}`]).filter((x) => x !== undefined)
      const avg = mine.length ? Math.round(mine.reduce((a, b) => a + b, 0) / mine.length) : (e.quizScore ?? 88)
      return { ...e, completedModules: done, lastActivity: iso(TODAY),
        completedAt: done === n ? iso(TODAY) : null, quizScore: done === n ? avg : null }
    })
  }, [overrides, enrolled, scores])

  const enroll = useCallback((uid, cid) => {
    if (baseEnrollments.some((e) => e.userId === uid && e.courseId === cid)) return
    setEnrolled((l) => (l.includes(`${uid}:${cid}`) ? l : [...l, `${uid}:${cid}`]))
  }, [])

  const completeModule = useCallback((uid, cid, i, pct) => {
    const k = `${uid}:${cid}:${i}`
    setScores((s) => ({ ...s, [k]: Math.max(s[k] ?? 0, pct) }))
    if (pct < PASS_PCT) return
    const e = enrollments.find((x) => x.userId === uid && x.courseId === cid)
    if (i === (e ? e.completedModules : 0)) { enroll(uid, cid); setOverrides((o) => ({ ...o, [`${uid}:${cid}`]: i + 1 })) }
  }, [enrollments, enroll])

  const toggleFav = useCallback((uid, id) => {
    setFavs((f) => { const l = f[uid] ?? []; return { ...f, [uid]: l.includes(id) ? l.filter((x) => x !== id) : [...l, id] } })
  }, [])

  const value = {
    user: userId ? personById(userId) : null,
    signIn: setUserId, signOut: () => setUserId(null),
    enrollments, enroll, completeModule, scores,
    favs: favs[userId] ?? [], toggleFav: (id) => toggleFav(userId, id),
    videoSecs: (id) => vprog[`${userId}:${id}`] ?? 0,
    setVideoSecs: (id, s) => setVprog((p) => ({ ...p, [`${userId}:${id}`]: s })),
    vote: (id) => votes[`${userId}:${id}`] ?? null,
    setVote: (id, v) => setVotes((p) => ({ ...p, [`${userId}:${id}`]: v })),
    resetDemo: () => { setOverrides({}); setScores({}); setFavs({}); setEnrolled([]); setVprog({}); setVotes({}) },
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
