import { Link } from 'react-router-dom'
import { Footprints, GraduationCap, Medal, ShieldCheck, Star, Route, BadgeCheck, Heart, Award, Lock } from 'lucide-react'
import { useApp, fmtDate } from '../store.jsx'
import { courses, courseById } from '../data/courses.js'
import { paths } from '../data/learning.js'
import { pathProgress } from './Paths.jsx'
import { PageTitle } from '../components/bits.jsx'

export default function Achievements() {
  const { user, enrollments, favs, scores } = useApp()
  const mine = enrollments.filter((e) => e.userId === user.id)
  const byId = Object.fromEntries(mine.map((e) => [e.courseId, e]))
  const done = mine.filter((e) => e.completedModules >= courseById(e.courseId).modules.length)
  const doneIds = done.map((e) => e.courseId)
  const modulesDone = mine.reduce((s, e) => s + e.completedModules, 0)
  const perfect = done.some((e) => e.quizScore === 100) || Object.entries(scores).some(([k, v]) => k.startsWith(`${user.id}:`) && v === 100)
  const mand = courses.filter((c) => c.mandatory)

  const badges = [
    { name: 'First Steps', desc: 'Complete your first module', icon: Footprints, got: modulesDone >= 1 },
    { name: 'Course Complete', desc: 'Finish a course', icon: GraduationCap, got: done.length >= 1 },
    { name: 'Hat-trick', desc: 'Finish three courses', icon: Medal, got: done.length >= 3 },
    { name: 'Compliance Champion', desc: 'Finish both compliance courses', icon: ShieldCheck, got: ['c11', 'c12'].every((c) => doneIds.includes(c)) },
    { name: 'Mandatory Done', desc: 'Finish every mandatory course', icon: BadgeCheck, got: mand.every((c) => doneIds.includes(c.id)) },
    { name: 'Perfect Score', desc: 'Score 100% on a quiz', icon: Star, got: perfect },
    { name: 'Path Finisher', desc: 'Complete a learning path', icon: Route, got: paths.some((p) => pathProgress(p, byId).complete) },
    { name: 'Curator', desc: 'Favourite three items', icon: Heart, got: favs.length >= 3 },
  ]
  const earned = badges.filter((b) => b.got).length

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageTitle title="Achievements" sub={`${earned} of ${badges.length} badges earned. Personal progress only, with no ranking against colleagues.`} />
      <section>
        <h2 className="mb-3 text-lg font-bold">Badges</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {badges.map(({ name, desc, icon: Icon, got }) => (
            <div key={name} className={`rounded-2xl border p-4 text-center ${got ? 'border-brand-500 bg-white shadow-sm' : 'border-taupe-200 bg-taupe-50 opacity-70'}`}>
              <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${got ? 'bg-brand-500 text-white' : 'bg-taupe-200 text-taupe-500'}`}>{got ? <Icon size={26} /> : <Lock size={22} />}</span>
              <div className="mt-3 text-sm font-bold">{name}</div>
              <div className="text-xs text-taupe-700">{desc}</div>
              <div className={`mt-2 text-[11px] font-bold uppercase ${got ? 'text-emerald-700' : 'text-taupe-500'}`}>{got ? 'Earned' : 'Locked'}</div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-bold">Certificates</h2>
        {done.length === 0 && <p className="rounded-2xl border border-dashed border-taupe-300 bg-white p-6 text-sm text-taupe-700">No certificates yet. Complete a course to earn one.</p>}
        <ul className="grid gap-3 sm:grid-cols-2">
          {done.map((e) => {
            const c = courseById(e.courseId)
            return (
              <li key={e.courseId}>
                <Link to={`/course/${c.id}/certificate`} className="flex items-center gap-3 rounded-xl border border-taupe-200 bg-white p-4 hover:border-brand-500">
                  <Award className="shrink-0 text-brand-500" />
                  <div><div className="font-bold">{c.title}</div><div className="text-xs text-taupe-700">Completed {fmtDate(e.completedAt)}{e.quizScore ? ` · ${e.quizScore}%` : ''}</div></div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
